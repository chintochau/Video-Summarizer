import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  recentAccessTimestamp: { type: Date, default: Date.now },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  type: {
    type: String,
    required: true,
    enum: ["observation", "plan", "reflection"],
  },
  relatedAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Agent",
  },
  importance: { type: Number, required: true },
  embedding: { type: [Number], required: true },
}, { timestamps: true });


export const Memory = mongoose.model("Memory", memorySchema);