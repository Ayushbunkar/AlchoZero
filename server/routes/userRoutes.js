import express from "express";
import { getUser, updateSettings } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUser);
router.put("/settings", updateSettings);

export default router;
