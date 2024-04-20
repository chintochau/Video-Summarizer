import mongoose from "mongoose";

const EmbeddingCollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    embeddings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Embedding"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const EmbeddingCollection = mongoose.model("EmbeddingCollection", EmbeddingCollectionSchema);

export default EmbeddingCollection;