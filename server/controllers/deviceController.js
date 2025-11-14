import Device from "../models/Device.js";

export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.json(device);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
