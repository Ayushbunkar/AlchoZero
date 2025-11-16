import Vehicle from "../models/Vehicle.js";

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ lastSeen: -1 });
    res.json(vehicles);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addVehicle = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.licensePlate && !payload.plate) {
      return res.status(400).json({ message: "licensePlate is required" });
    }
    const vehicle = await Vehicle.create({
      licensePlate: payload.licensePlate || payload.plate,
      model: payload.model || payload.make,
      deviceId: payload.deviceId,
      currentDriverId: payload.currentDriverId,
      lastSeen: payload.lastSeen,
    });
    res.json(vehicle);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
