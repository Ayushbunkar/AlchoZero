import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  status: { type: String, default: "active" },
  ownerId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

deviceSchema.index({ ownerId: 1 });

export default mongoose.model("Device", deviceSchema);
