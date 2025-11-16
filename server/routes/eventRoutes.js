import express from "express";
import { getEvents, getRecentEvents } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/recent", getRecentEvents);

export default router;
