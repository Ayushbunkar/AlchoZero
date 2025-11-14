import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  role: { type: String, default: "driver" },
  emergencyContact: { type: String },
  threshold: { type: Number, default: 0.7 },
});

export default mongoose.model("User", userSchema);
