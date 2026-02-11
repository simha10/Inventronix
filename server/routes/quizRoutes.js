import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { Quiz } from '../models/Quiz.js';

const router = express.Router();

// Create a new quiz
router.post('/create', authenticateAdmin, async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        // Auto-generate question IDs if not provided
        const processedQuestions = (questions || []).map((q, i) => ({
            ...q,
            id: q.id || `q${i}`,
        }));

        const newQuiz = new Quiz({
            title,
            description,
            questions: processedQuestions
        });

        await newQuiz.save();

        res.status(201).json({ success: true, quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all quizzes (for admin selection)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json({ success: true, quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
