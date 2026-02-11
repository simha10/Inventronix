import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    answers: { type: Map, of: String, default: {} }, // questionId -> answer
    score: { type: Number, default: 0 },
    submittedAt: Date,
    startedAt: { type: Date, default: Date.now },
    timeTaken: Number,
});

const roomSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    quizSnapshot: { type: Object, required: true }, // Store copy of quiz to avoid mutations affecting live games
    isActive: { type: Boolean, default: true },
    cancelledAt: Date,
    expiresAt: { type: Date, required: true },
    participants: [participantSchema],
    createdAt: { type: Date, default: Date.now },
});

export const Room = mongoose.model('Room', roomSchema);
