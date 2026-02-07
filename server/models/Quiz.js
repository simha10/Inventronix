import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    questions: [questionSchema],
    createdBy: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model('Quiz', quizSchema);
