import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    language: { type: String },
    originalTranscript: {
        type: String,
    },
    sourceId: {
        type: String,
    },
    summary: {
        type: String,
    },
    summaryType: {
        type: String, // Detail, Simplified, List, etc.
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Add more fields as necessary
});

const Summary = mongoose.model('Summary', SummarySchema);

export default Summary