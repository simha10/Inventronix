import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    quizSnapshot: { type: Object, required: true }, // Store copy of quiz at time of room creation
    status: {
        type: String,
        enum: ['CREATED', 'ACTIVE', 'LOCKED', 'RESULTS_READY', 'ARCHIVED'],
        default: 'CREATED'
    },
    duration: { type: Number, required: true }, // Duration in minutes

    // Lifecycle timestamps
    createdAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    expiresAt: { type: Date, index: true }, // For finding expired active rooms
    cancelledAt: { type: Date },

    // Concurrency & State
    participantCount: { type: Number, default: 0 },
    maxParticipants: { type: Number, default: 100 },
    submittedCount: { type: Number, default: 0 },
    leaderboardSnapshot: { type: Array, default: [] } // Cached results
});

// Index for finding active rooms efficiently
roomSchema.index({ status: 1 });

export const Room = mongoose.model('Room', roomSchema);
