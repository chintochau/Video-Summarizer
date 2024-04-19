import mongoose from "mongoose";

const EmbeddingsSchema = new mongoose.Schema({
    videoSourceId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    embeddings: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

const Embeddings = mongoose.model("Embeddings", EmbeddingsSchema);

export default Embeddings;