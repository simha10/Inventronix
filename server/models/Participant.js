import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date
    },
    submittedAt: {
        type: Date
    },
    score: {
        type: Number,
        default: 0
    },
    timeTaken: {
        type: Number
    },
    status: {
        type: String,
        enum: ['JOINED', 'SUBMITTED'],
        default: 'JOINED'
    }
});

// Ensure unique names per room
participantSchema.index({ roomId: 1, name: 1 }, { unique: true });

// Index for leaderboard sorting
participantSchema.index({ roomId: 1, score: -1, timeTaken: 1 });

export const Participant = mongoose.model('Participant', participantSchema);
