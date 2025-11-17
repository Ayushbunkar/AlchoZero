import express from "express";
import { addDevice, getDevices } from "../controllers/deviceController.js";
import Device from "../models/Device.js";
import { requireAuth } from "../utils/authMiddleware.js";
import { requireRole } from "../utils/roleMiddleware.js";

const router = express.Router();

router.get("/", getDevices);
router.post("/add", addDevice);
router.post('/bind', requireAuth, async (req, res) => {
	try {
		const { deviceId } = req.body || {};
		if (!deviceId) return res.status(400).json({ message: 'deviceId required' });
		const device = await Device.findById(deviceId);
		if (!device) return res.status(404).json({ message: 'Device not found' });
		// Allow binding only if unowned
		if (device.ownerId && device.ownerId !== req.userId) return res.status(409).json({ message: 'Device already owned' });
		device.ownerId = req.userId;
		await device.save();
		return res.json({ deviceId: device._id });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
});

export default router;
