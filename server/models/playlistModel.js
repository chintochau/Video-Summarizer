import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

PlaylistSchema.index({ userId: 1});


const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist