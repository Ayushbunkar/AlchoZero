import express from "express";
import { getEvents, getRecentEvents, seedEvent } from "../controllers/eventController.js";
import { requireAuth } from "../utils/authMiddleware.js";
import Device from "../models/Device.js";
import Event from "../models/Event.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/recent", getRecentEvents);

// Convenience: events for the authenticated user's device(s)
router.get("/mine", requireAuth, async (req, res) => {
	try {
		const devices = await Device.find({ ownerId: String(req.userId) }).lean();
		const ids = devices.map((d) => String(d._id));
		const lim = Math.max(1, Math.min(parseInt(req.query?.limit || 50, 10) || 50, 200));
		const events = await Event.find({ deviceId: { $in: ids } }).sort({ timestamp: -1 }).limit(lim).exec();
		res.json(events);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
});

router.post("/seed", requireAuth, seedEvent);

// SSE stream of latest events (push every 5s)
router.get('/stream', requireAuth, async (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	});
	const devices = await Device.find({ ownerId: String(req.userId) }).lean();
	const ids = devices.map(d => String(d._id));
	const send = async () => {
		try {
			const ev = await Event.find({ deviceId: { $in: ids } }).sort({ timestamp: -1 }).limit(1).lean();
			const latest = ev[0];
			if (latest) {
				res.write(`data: ${JSON.stringify(latest)}\n\n`);
			}
		} catch (e) {
			res.write(`event: error\ndata: ${JSON.stringify({ message: e.message })}\n\n`);
		}
	};
	const interval = setInterval(send, 5000);
	send();
	req.on('close', () => clearInterval(interval));
});

export default router;
