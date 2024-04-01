import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tier: {
    type: String,
    enum: ["free", "tier-professional", "tier-mastermind"],
    default: "free",
  },
  credits: { type: Number, default: 5 },
  subscriptionId: { type: String }, // Add the subscription ID field
  expirationDate: { type: Date }, // Add the expiration date field
});

UserSchema.pre("save", function (next) {
  if (this.expirationDate && typeof this.expirationDate === "number") {
    this.expirationDate = new Date(this.expirationDate * 1000); // Convert seconds to milliseconds
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
