import express from 'express';
import { Room } from '../models/Room.js';
import { Quiz } from '../models/Quiz.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate room code
const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Create a room from a quiz (Admin only)
router.post('/create', authenticateAdmin, async (req, res) => {
    try {
        const { quizId, durationMinutes } = req.body;
        const duration = Math.max(5, Math.min(durationMinutes || 60, 480)); // 5 min to 8 hours, default 60

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        const code = generateRoomCode();
        const expiresAt = new Date(Date.now() + duration * 60 * 1000);

        const room = new Room({
            code,
            quizId,
            quizSnapshot: quiz.toObject(),
            expiresAt,
        });

        await room.save();
        res.json({
            success: true,
            room: {
                code: room.code,
                expiresAt: room.expiresAt,
                _id: room._id,
                quizTitle: quiz.title,
                participantCount: 0,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all active rooms (Admin only) — for "Ongoing Rooms" section
router.get('/active', authenticateAdmin, async (req, res) => {
    try {
        const rooms = await Room.find({
            isActive: true,
            cancelledAt: { $exists: false },
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        const activeRooms = rooms.map(r => ({
            _id: r._id,
            code: r.code,
            quizTitle: r.quizSnapshot?.title || 'Quiz Room',
            participantCount: r.participants.length,
            submittedCount: r.participants.filter(p => p.submittedAt).length,
            expiresAt: r.expiresAt,
            createdAt: r.createdAt,
        }));

        res.json({ success: true, rooms: activeRooms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get recently completed rooms (Admin only) — for "Recent Quizzes" section
router.get('/recent', authenticateAdmin, async (req, res) => {
    try {
        const rooms = await Room.find({
            expiresAt: { $lte: new Date() },
        }).sort({ expiresAt: -1 }).limit(20);

        const recentRooms = rooms.map(r => ({
            _id: r._id,
            code: r.code,
            quizTitle: r.quizSnapshot?.title || 'Quiz Room',
            participantCount: r.participants.length,
            submittedCount: r.participants.filter(p => p.submittedAt).length,
            totalQuestions: r.quizSnapshot?.questions?.length || 0,
            topScore: r.participants.length > 0
                ? Math.max(...r.participants.map(p => p.score || 0))
                : 0,
            expiresAt: r.expiresAt,
            createdAt: r.createdAt,
        }));

        res.json({ success: true, rooms: recentRooms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Public: Get basic room info (for students before joining)
router.get('/:code/info', async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const isExpired = new Date() > room.expiresAt;
        const isCancelled = !!room.cancelledAt;
        const timeLeft = room.expiresAt.getTime() - Date.now();
        const canJoin = !isExpired && !isCancelled && timeLeft > 5 * 60 * 1000;

        res.json({
            success: true,
            name: room.quizSnapshot.title || 'Quiz Room',
            questionCount: room.quizSnapshot.questions?.length || 0,
            participantCount: room.participants.length,
            expiresAt: room.expiresAt,
            isExpired,
            isCancelled,
            canJoin,
            isActive: room.isActive,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Join a room (Student)
router.post('/join', async (req, res) => {
    try {
        const { code, name } = req.body;
        const room = await Room.findOne({ code: code.toUpperCase() });

        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (!room.isActive) return res.status(400).json({ error: 'Room is not active' });
        if (new Date() > room.expiresAt) return res.status(400).json({ error: 'Room expired' });

        // Check if name taken
        const existing = room.participants.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            // Allow re-join with same name (return existing data)
            const questions = room.quizSnapshot.questions.map(q => ({
                id: q.id || q._id?.toString(),
                question: q.question,
                options: q.options
            }));

            // Convert Map to plain object
            const answersObj = {};
            if (existing.answers) {
                existing.answers.forEach((val, key) => {
                    answersObj[key] = val;
                });
            }

            return res.json({
                success: true,
                participantId: existing.id,
                questions,
                expiresAt: room.expiresAt,
                roomName: room.quizSnapshot.title || 'Quiz Room',
                answers: answersObj,
                isSubmitted: !!existing.submittedAt,
                rejoin: true,
            });
        }

        const participant = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            startedAt: new Date()
        };

        room.participants.push(participant);
        await room.save();

        const questions = room.quizSnapshot.questions.map(q => ({
            id: q.id || q._id?.toString(),
            question: q.question,
            options: q.options
        }));

        res.json({
            success: true,
            participantId: participant.id,
            questions,
            expiresAt: room.expiresAt,
            roomName: room.quizSnapshot.title || 'Quiz Room',
            answers: {},
            isSubmitted: false,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit Answer / Sync
router.post('/:code/submit', async (req, res) => {
    try {
        const { code } = req.params;
        const { participantId, answers, submit } = req.body;

        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (room.cancelledAt) return res.status(400).json({ error: 'This room has been cancelled by the admin' });

        const participant = room.participants.find(p => p.id === participantId);
        if (!participant) return res.status(404).json({ error: 'Participant not found' });

        if (participant.submittedAt) {
            return res.status(400).json({ error: 'Already submitted' });
        }

        if (answers) {
            for (const [qId, ans] of Object.entries(answers)) {
                participant.answers.set(qId, String(ans));
            }
        }

        if (submit) {
            participant.submittedAt = new Date();
            participant.timeTaken = Date.now() - new Date(participant.startedAt).getTime();

            // Calculate score — participant answers are stored as option indices (e.g. "0", "1"),
            // so we need to look up the actual option text at that index and compare to correctAnswer
            let score = 0;
            const quizQuestions = room.quizSnapshot.questions;
            quizQuestions.forEach(q => {
                const qId = q.id || q._id?.toString();
                const participantAnswer = participant.answers.get(qId);
                if (participantAnswer !== undefined) {
                    const answerIndex = parseInt(participantAnswer, 10);
                    const selectedOption = !isNaN(answerIndex) && q.options?.[answerIndex];
                    // Compare the option text at the selected index with the correct answer
                    if (selectedOption && String(selectedOption) === String(q.correctAnswer)) {
                        score++;
                    }
                }
            });
            participant.score = score;
        }

        await room.save();
        res.json({ success: true, score: participant.score });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cancel a room (Admin only)
router.post('/:code/cancel', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (room.cancelledAt) return res.status(400).json({ error: 'Room already cancelled' });

        room.cancelledAt = new Date();
        room.isActive = false;
        await room.save();

        res.json({ success: true, message: 'Room cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Leaderboard (Public — available after room expires or all submitted)
router.get('/:code/leaderboard', async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const isExpired = new Date() > room.expiresAt;
        const allSubmitted = room.participants.length > 0 && room.participants.every(p => p.submittedAt);

        if (!isExpired && !allSubmitted) {
            return res.status(400).json({ error: 'Leaderboard not available yet. Wait for the timer to end.' });
        }

        const totalQuestions = room.quizSnapshot.questions?.length || 0;

        // Include ALL participants — submitted ones ranked by score/time, 
        // unsubmitted ones at the bottom with score 0
        const leaderboard = room.participants
            .map(p => ({
                name: p.name,
                score: p.submittedAt ? p.score : 0,
                timeTaken: p.timeTaken || 0,
                submitted: !!p.submittedAt,
            }))
            .sort((a, b) => {
                // Submitted participants first
                if (a.submitted !== b.submitted) return a.submitted ? -1 : 1;
                // Then by score desc
                if (b.score !== a.score) return b.score - a.score;
                // Then by time asc
                return (a.timeTaken || Infinity) - (b.timeTaken || Infinity);
            })
            .map((p, index) => ({
                rank: index + 1,
                name: p.name,
                score: p.score,
                timeTaken: p.timeTaken,
                totalQuestions,
                submitted: p.submitted,
            }));

        res.json({
            success: true,
            leaderboard,
            roomName: room.quizSnapshot.title || 'Quiz Room',
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Room Status (Admin) - live dashboard
router.get('/:code/status', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
