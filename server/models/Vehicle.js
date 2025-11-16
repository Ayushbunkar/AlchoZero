import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  licensePlate: { type: String, required: true },
  model: { type: String },
  deviceId: { type: String },
  currentDriverId: { type: String },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vehicle", vehicleSchema);
