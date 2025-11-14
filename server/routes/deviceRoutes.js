import express from "express";
import { addDevice, getDevices } from "../controllers/deviceController.js";

const router = express.Router();

router.get("/", getDevices);
router.post("/add", addDevice);

export default router;
