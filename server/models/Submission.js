import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
        required: true,
        unique: true, // One submission per participant
        index: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    answers: {
        type: Map,
        of: String, // QuestionID -> OptionIndex (as String)
        default: {}
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for fast lookups by room (cleanup/analytics)
submissionSchema.index({ roomId: 1 });

export const Submission = mongoose.model('Submission', submissionSchema);
