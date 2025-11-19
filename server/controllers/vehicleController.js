import { listVehicles, createVehicle } from '../services/vehicleService.js';

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await listVehicles({ limit: 100 });
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
    const vehicle = await createVehicle({
      licensePlate: payload.licensePlate || payload.plate,
      model: payload.model || payload.make,
      deviceId: payload.deviceId,
      currentDriverId: payload.currentDriverId,
      ownerId: payload.ownerId || req.userId
    });
    res.json(vehicle);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
