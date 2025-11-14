import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
  deviceId: { type: String },
  confidence: { type: Number, required: true },
  status: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Detection", detectionSchema);
