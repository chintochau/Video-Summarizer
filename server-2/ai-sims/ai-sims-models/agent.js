import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  name: String,
  location: {
    x: Number,
    y: Number,
  },
  memory: {
    schedule: String,
    personality: String,
    pastObservations: [String],
    reflections: [String],
  },
  currentAction: String,
  goal: String,
  state: String,
});

export const Agent = mongoose.model("Agent", agentSchema);
