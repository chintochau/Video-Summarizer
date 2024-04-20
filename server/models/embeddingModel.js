import mongoose from "mongoose";

const EmbeddingSchema = new mongoose.Schema({
    videoSourceId: {
        type: String,
        required: true,
    },
    videoTitle: {
        type: String,
        required: true,
        default: "No Title Available"
    },
    videoSourceType: {
        type: String,
        required: true,
    },
    collectionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmbeddingCollection",
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    embedding: {
        type: Array,
        required: true,
    },
    referenceTimeRange: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Embedding = mongoose.model("Embedding", EmbeddingSchema);

export default Embedding;