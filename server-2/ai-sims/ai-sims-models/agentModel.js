import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name:{
    type: String,
    required: true,
    default: "Agent",
  },
  location: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  triats: {
    type: Array,
  },
  currentAction: {
    type: String,
    default: "idle",
  },
  currentGoal: {
    type: String,
    default: "none",
  },
});

export const Agent = mongoose.model("Agent", agentSchema);
