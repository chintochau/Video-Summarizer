import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sourceType: {
        type: String,
        enum: ['youtube', 'user-upload', 'audio', 'srt-file'],
        required: true,
    },
    sourceTitle: {
        type: String,
    },
    sourceId: {
        type: String,
        required: true,
    },
    originalTranscript: {
        type: String,
    },
    summary: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Add more fields as necessary
});

const Summary = mongoose.model('Summary', SummarySchema);

export default Summary