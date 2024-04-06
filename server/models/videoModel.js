import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
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
    sourceId: {
        type: String,
        required: true,
    },
    sourceTitle: {
        type: String,
    },
    author: {
        type: String,
    },
    videoThumbnail: {
        type: String,
    },
    videoDuration: {
        type: Number,
    },
    originalTranscript: {
        type: String,
    },
    lastUpdated: {
        type: Date,
        default: new Date(), // Initialize as null or a default date value
    },
    // Other video fields as needed
});


const Video = mongoose.model('Video', VideoSchema);

export default Video