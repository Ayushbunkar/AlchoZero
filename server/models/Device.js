import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Device", deviceSchema);
