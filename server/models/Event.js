import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  deviceId: { type: String },
  riskLevel: { type: Number, required: true },
  status: { type: String },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Event", eventSchema);
