import express from "express";
import { addVehicle, getVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/", getVehicles);
router.post("/add", addVehicle);

export default router;
    