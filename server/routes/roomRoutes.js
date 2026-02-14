import express from 'express';
import { Room } from '../models/Room.js';
import { Quiz } from '../models/Quiz.js';
import { Participant } from '../models/Participant.js';
import { Submission } from '../models/Submission.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate room code
const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Helper to check room expiry
const checkRoomState = async (room) => {
    if (room.status === 'ACTIVE' && room.expiresAt && new Date() > room.expiresAt) {
        room.status = 'LOCKED';
        await room.save();
        return false; // No longer active
    }
    return room.status === 'ACTIVE';
};

// Create a room (Admin only)
router.post('/create', authenticateAdmin, async (req, res) => {
    try {
        const { quizId, durationMinutes } = req.body;
        const duration = Math.max(5, Math.min(durationMinutes || 60, 480));

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        const code = generateRoomCode();
        const room = new Room({
            code,
            quizId,
            quizSnapshot: quiz.toObject(),
            duration,
            maxParticipants: Math.min(req.body.maxParticipants || 100, 500),
            status: 'CREATED'
        });

        await room.save();
        res.json({
            success: true,
            room: {
                _id: room._id,
                code: room.code,
                status: room.status,
                duration: room.duration,
                quizTitle: quiz.title,
                participantCount: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create room: ' + error.message });
    }
});

// Start a room (Admin only)
router.post('/:code/start', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        if (room.status !== 'CREATED') {
            return res.status(400).json({ error: `Room is ${room.status}, cannot start` });
        }

        const now = new Date();
        room.status = 'ACTIVE';
        room.startedAt = now;
        room.expiresAt = new Date(now.getTime() + room.duration * 60 * 1000);

        await room.save();
        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Join a room (Student) - ATOMIC WITH LIMITS
router.post('/join', async (req, res) => {
    try {
        const { code, name } = req.body;

        // 1. ATOMIC CHECK & RESERVE
        // We attempt to increment participantCount ONLY IF it is less than maxParticipants
        // This prevents race conditions where 101 people join a 100-person room simultaneously.
        const room = await Room.findOneAndUpdate(
            {
                code: code.toUpperCase(),
                status: { $in: ['CREATED', 'ACTIVE'] },
                $expr: { $lt: ["$participantCount", "$maxParticipants"] } // Atomic condition
            },
            { $inc: { participantCount: 1 } },
            { new: true }
        );

        if (!room) {
            // Check why we failed (Room doesn't exist? Wrong status? Full?)
            const check = await Room.findOne({ code: code.toUpperCase() });
            if (!check) return res.status(404).json({ error: 'Room not found' });
            if (check.status === 'LOCKED' || check.status === 'ARCHIVED') return res.status(400).json({ error: 'Room is closed' });

            // If we are here, it means the room is full (participantCount >= maxParticipants)
            return res.status(400).json({ error: 'Room is full' });
        }

        // Lazy expiration check (if active)
        if (room.status === 'ACTIVE' && room.expiresAt && new Date() > room.expiresAt) {
            // Rollback reservation since we are rejecting
            await Room.updateOne({ _id: room._id }, { $inc: { participantCount: -1 } });

            room.status = 'LOCKED';
            await room.save();
            return res.status(400).json({ error: 'Room is closed' });
        }

        // 2. Try to create participant
        try {
            const participant = new Participant({
                roomId: room._id,
                name,
                joinedAt: new Date()
            });
            await participant.save();

            // Prepare response
            const questions = room.quizSnapshot.questions.map(q => ({
                id: q.id || q._id?.toString(),
                question: q.question,
                options: q.options
            }));

            res.json({
                success: true,
                participantId: participant._id,
                questions,
                expiresAt: room.expiresAt,
                roomName: room.quizSnapshot.title || 'Quiz Room',
                answers: {},
                isSubmitted: false
            });

        } catch (err) {
            // DUPLICATE NAME -> RE-JOIN or ERROR
            // If duplicate, we must ROLLBACK the reservation increment we just did
            // UNLESS it's a rejoin of an existing user (which doesn't consume a *new* spot, but we already incremented)

            // Wait! If it's a rejoin, we effectively "consumed" a spot that was ALREADY accounted for in the count?
            // Actually, if they are re-joining, they are already in the DB.
            // But we just incremented count thinking it was a new person.
            // So for REJOIN, we strictly MUST decrement the count we just added, because they were already counted previously.

            await Room.updateOne({ _id: room._id }, { $inc: { participantCount: -1 } });

            if (err.code === 11000) {
                const existing = await Participant.findOne({ roomId: room._id, name });

                // If the user actually exists, return their data (Rejoin)
                if (existing) {
                    let existingAnswers = {};
                    if (existing.status === 'SUBMITTED') {
                        const sub = await Submission.findOne({ participantId: existing._id });
                        if (sub && sub.answers) existingAnswers = Object.fromEntries(sub.answers);
                    }

                    const questions = room.quizSnapshot.questions.map(q => ({
                        id: q.id || q._id?.toString(),
                        question: q.question,
                        options: q.options
                    }));

                    return res.json({
                        success: true,
                        participantId: existing._id,
                        questions,
                        expiresAt: room.expiresAt,
                        roomName: room.quizSnapshot.title || 'Quiz Room',
                        answers: existingAnswers,
                        isSubmitted: existing.status === 'SUBMITTED',
                        rejoin: true
                    });
                }
            }
            throw err; // Re-throw other errors
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit Answer - ATOMIC
router.post('/:code/submit', async (req, res) => {
    try {
        const { code } = req.params;
        const { participantId, answers, submit } = req.body;

        if (!submit) {
            // Intermediate sync is not stored in DB to save writes 
            // (Or could use Redis, but for now we only process final submit per strict requirements)
            // If we really want "sync" without submit, we'd need a simpler update.
            // For this high-concurrency refactor, we focus on FINAL submission.
            return res.json({ success: true, message: "Intermediate sync ignored in high-load mode" });
        }

        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        // Lazy expiration check
        if (room.status === 'ACTIVE' && room.expiresAt && new Date() > room.expiresAt) {
            room.status = 'LOCKED';
            await room.save();
        }

        if (room.cancelledAt || room.status === 'LOCKED' || room.status === 'ARCHIVED') {
            return res.status(400).json({ error: 'Room is closed' });
        }

        // Calculate score in memory
        let score = 0;
        const quizQuestions = room.quizSnapshot.questions;
        quizQuestions.forEach(q => {
            const qId = q.id || q._id?.toString();
            const participantAnswer = answers[qId];
            if (participantAnswer !== undefined) {
                const answerIndex = parseInt(participantAnswer, 10);
                const selectedOption = !isNaN(answerIndex) && q.options?.[answerIndex];
                if (selectedOption && String(selectedOption) === String(q.correctAnswer)) {
                    score++;
                }
            }
        });

        const now = new Date();
        const submittedAt = now;

        // Atomic Check-and-Set: Update only if status is JOINED (not SUBMITTED)
        // We also need joinedAt to calculate timeTaken, so we might need a read first?
        // Optimistic: Just do update and if match count 0, it means either bad ID or already submitted.

        // We need 'startedAt' to calc timeTaken. 
        const pCheck = await Participant.findById(participantId);
        if (!pCheck) return res.status(404).json({ error: 'Participant not found' });

        const timeTaken = now.getTime() - new Date(pCheck.startedAt || pCheck.joinedAt).getTime(); // fallback to joinedAt

        const updatedParticipant = await Participant.findOneAndUpdate(
            { _id: participantId, status: 'JOINED' },
            {
                $set: {
                    status: 'SUBMITTED',
                    submittedAt,
                    score,
                    timeTaken
                }
            },
            { new: true }
        );

        if (!updatedParticipant) {
            return res.status(400).json({ error: 'Already submitted' });
        }

        // Async: Store detailed answers in Submission collection
        // We do this AFTER verifying participant update succeeded (first-writer wins)
        // Fire-and-forget submission count increment
        Room.updateOne({ _id: room._id }, { $inc: { submittedCount: 1 } }).exec();

        await Submission.create({
            participantId,
            roomId: room._id,
            answers,
            submittedAt
        });

        res.json({ success: true, score });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Leaderboard - Returns snapshot if available or error
router.get('/:code/leaderboard', async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        // Admin override to calculate on fly? 
        // For reliability, we stick to the plan: visible only in RESULTS_READY for public
        // But for admin dashboard we might want it live.
        // Assuming public access here.

        if (room.status === 'RESULTS_READY' || room.status === 'ARCHIVED') {
            return res.json({
                success: true,
                leaderboard: room.leaderboardSnapshot,
                roomName: room.quizSnapshot.title,
                status: room.status
            });
        }

        // Explicitly check expiry and Transition
        if (room.status === 'ACTIVE' && room.expiresAt && new Date() > room.expiresAt) {
            room.status = 'LOCKED';
            await room.save();
            // Lock triggered, but leaderboard not ready yet (requires compute).
            // Admin should trigger compute or we compute here?
            // To be robust: If locked, we can trigger compute if not present.
        }

        if (room.status === 'LOCKED') {
            // Computation Strategy:
            // Aggregate Top 50 participants
            const leaders = await Participant.find({ roomId: room._id, status: 'SUBMITTED' })
                .sort({ score: -1, timeTaken: 1 })
                .limit(50)
                .lean();

            const leaderboard = leaders.map((p, i) => ({
                rank: i + 1,
                name: p.name,
                score: p.score,
                timeTaken: p.timeTaken,
                submitted: true
            }));

            // Save snapshot and transition
            room.leaderboardSnapshot = leaderboard;
            room.status = 'RESULTS_READY';
            await room.save();

            return res.json({
                success: true,
                leaderboard,
                roomName: room.quizSnapshot.title,
                status: 'RESULTS_READY'
            });
        }

        return res.status(400).json({ error: 'Leaderboard not available yet' });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Public: Get Info
router.get('/:code/info', async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() })
            .select('status expiresAt participantCount maxParticipants submittedCount quizSnapshot.title quizSnapshot.questions.length cancelledAt');

        if (!room) return res.status(404).json({ error: 'Room not found' });

        const isExpired = room.expiresAt ? new Date() > room.expiresAt : false;

        res.json({
            success: true,
            name: room.quizSnapshot?.title,
            questionCount: room.quizSnapshot?.questions?.length || 0,
            participantCount: room.participantCount,
            maxParticipants: room.maxParticipants || 100,
            submittedCount: room.submittedCount,
            expiresAt: room.expiresAt,
            status: room.status, // CREATED, ACTIVE, LOCKED, RESULTS_READY
            isExpired,
            isCancelled: !!room.cancelledAt,
            canJoin: room.status === 'CREATED' || (room.status === 'ACTIVE' && !isExpired)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Close/Finish Room (Manual Trigger)
router.post('/:code/close', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        room.status = 'LOCKED'; // Will trigger leaderboard computation on next fetch
        room.expiresAt = new Date(); // Expire immediately
        await room.save();

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Get Active
router.get('/active', authenticateAdmin, async (req, res) => {
    try {
        const rooms = await Room.find({
            status: 'ACTIVE',
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        const activeRooms = rooms.map(r => ({
            _id: r._id,
            code: r.code,
            quizTitle: r.quizSnapshot?.title || 'Quiz Room',
            participantCount: r.participantCount,
            submittedCount: r.submittedCount,
            expiresAt: r.expiresAt,
            createdAt: r.createdAt,
        }));

        res.json({ success: true, rooms: activeRooms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Get Recent
router.get('/recent', authenticateAdmin, async (req, res) => {
    try {
        const rooms = await Room.find({
            $or: [{ status: 'RESULTS_READY' }, { status: 'LOCKED' }, { status: 'ARCHIVED' }]
        }).sort({ expiresAt: -1 }).limit(20);

        const recentRooms = rooms.map(r => ({
            _id: r._id,
            code: r.code,
            quizTitle: r.quizSnapshot?.title || 'Quiz Room',
            participantCount: r.participantCount,
            submittedCount: r.submittedCount,
            totalQuestions: r.quizSnapshot?.questions?.length || 0,
            expiresAt: r.expiresAt,
            createdAt: r.createdAt,
        }));

        res.json({ success: true, rooms: recentRooms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a room (Admin only) - Cascading Delete
router.delete('/:code', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });

        if (!room) return res.status(404).json({ error: 'Room not found' });

        // Cascading delete
        await Participant.deleteMany({ roomId: room._id });
        await Submission.deleteMany({ roomId: room._id });
        await Room.deleteOne({ _id: room._id });

        res.json({ success: true, message: 'Room and all associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
