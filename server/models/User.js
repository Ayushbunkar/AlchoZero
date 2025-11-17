import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, default: "driver" },
    passwordHash: { type: String },
    emergencyContact: { type: String },
    threshold: { type: Number, default: 0.7 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
