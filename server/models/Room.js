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
    code: { type: String, required: true, unique: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    quizSnapshot: { type: Object, required: true }, // Store copy of quiz at time of room creation
    status: {
        type: String,
        enum: ['waiting', 'active', 'completed'],
        default: 'waiting'
    },
    duration: { type: Number, required: true }, // Duration in minutes
    startedAt: { type: Date },
    expiresAt: { type: Date }, // Will be set when status becomes active
    cancelledAt: { type: Date },
    participants: [participantSchema],
    createdAt: { type: Date, default: Date.now } // TTL index could be added here
});

export const Room = mongoose.model('Room', roomSchema);
