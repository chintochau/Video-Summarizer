import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["payment", "subscription"],
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  fulfillmentStatus: {
    type: String,
    enum: ["pending", "fulfilled", "failed"],
    default: "pending",
  },
  sessionId: { type: String, required: true },
  subscriptionId:{type:String},
  // Add any additional fields as necessary
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
