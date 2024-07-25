import mongoose from "mongoose";

const FreeServiceUsageSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
    enum: ["summary"],
    default: "summary",
  },
});

const FreeServiceUsage = mongoose.model("FreeServiceUsage", FreeServiceUsageSchema);
export default FreeServiceUsage