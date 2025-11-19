import { listDevices, createDevice, findDevicesByOwnerId } from '../services/deviceService.js';

export const getDevices = async (req, res) => {
  try {
    // If user is authenticated and is a driver, only show their devices
    if (req.userId && req.user?.role === 'driver') {
      const devices = await findDevicesByOwnerId(req.userId);
      return res.json(devices);
    }

    // Admin/superadmin can see all devices
    const devices = await listDevices({ limit: 100 });
    res.json(devices);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addDevice = async (req, res) => {
  try {
    // Set ownerId to authenticated user if not provided
    const deviceData = {
      ...req.body,
      ownerId: req.body.ownerId || req.userId
    };

    const device = await createDevice(deviceData);
    res.json(device);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
