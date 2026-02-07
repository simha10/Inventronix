import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/verify', authenticateAdmin, (req, res) => {
    res.json({ success: true, message: 'Admin verified' });
});

export default router;
