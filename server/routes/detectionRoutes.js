import express from "express";
import { receiveDetection } from "../controllers/detectionController.js";

const router = express.Router();

router.post("/update", receiveDetection);

export default router;
