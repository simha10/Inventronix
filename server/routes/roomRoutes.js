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
        const { quizId, name } = req.body;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        const code = generateRoomCode();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        const room = new Room({
            code,
            quizId,
            quizSnapshot: quiz.toObject(), // Snapshot questions
            expiresAt,
            // You might want to add a 'name' field to Room model if you want to display "Room Name"
        });

        await room.save();
        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Join a room (Student)
router.post('/join', async (req, res) => {
    try {
        const { code, name } = req.body;
        const room = await Room.findOne({ code });

        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (!room.isActive) return res.status(400).json({ error: 'Room is not active' });
        if (new Date() > room.expiresAt) return res.status(400).json({ error: 'Room expired' });

        // Check if name taken
        if (room.participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            return res.status(400).json({ error: 'Name already taken' });
        }

        const participant = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            startedAt: new Date()
        };

        room.participants.push(participant);
        await room.save();

        // Return room info (sanitized, no correct answers yet if you want to hide them)
        // For simplicity, returning questions without correct answers
        const questions = room.quizSnapshot.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        }));

        res.json({
            success: true,
            participantId: participant.id,
            questions,
            roomCode: room.code
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit Answer / Sync
router.post('/:code/submit', async (req, res) => {
    try {
        const { code } = req.params;
        const { participantId, answers, submit } = req.body; // answers: { questionId: answer }

        const room = await Room.findOne({ code });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const participant = room.participants.find(p => p.id === participantId);
        if (!participant) return res.status(404).json({ error: 'Participant not found' });

        if (answers) {
            // Update answers
            for (const [qId, ans] of Object.entries(answers)) {
                participant.answers.set(qId, ans);
            }
        }

        if (submit) {
            participant.submittedAt = new Date();
            // Calculate score
            let score = 0;
            room.quizSnapshot.questions.forEach(q => {
                if (participant.answers.get(q.id) === q.correctAnswer) {
                    score++;
                }
            });
            participant.score = score;
        }

        await room.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Room Status (Admin) - live dashboard
router.get('/:code/status', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const room = await Room.findOne({ code });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
