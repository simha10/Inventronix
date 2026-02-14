import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true
}));
app.use(express.json());

import { rateLimiter } from './middleware/rateLimit.js';

// Global Rate Limit (Basic DDOS protection)
app.use(rateLimiter({ windowMs: 60 * 1000, max: 1000 })); // 1000 req/min global

// Specific Route Limits - High limits for Load Testing (Production should be lower per IP)
const joinLimiter = rateLimiter({ windowMs: 60 * 1000, max: 1000, message: "Too many join attempts" });
const submitLimiter = rateLimiter({ windowMs: 10 * 1000, max: 1000, message: "Submitting too fast" });

// Routes
app.use('/api/admin', rateLimiter({ windowMs: 60 * 1000, max: 50 }), adminRoutes); // Stricter for admin
app.use('/api/quiz', quizRoutes);
app.use('/api/room/join', joinLimiter); // Protect Join
app.use('/api/room', (req, res, next) => {
    if (req.url.includes('/submit')) {
        return submitLimiter(req, res, next);
    }
    next();
}, roomRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        // Start Server only after DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
