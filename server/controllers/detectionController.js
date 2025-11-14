import Detection from "../models/Detection.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { isHighRisk } from "../utils/validateThreshold.js";

export const receiveDetection = async (req, res) => {
  try {
    const { deviceId, confidence, status } = req.body || {};

    if (typeof confidence !== "number" || confidence < 0 || confidence > 1) {
      return res.status(400).json({ success: false, message: "Invalid confidence" });
    }

    const detection = await Detection.create({ deviceId, confidence, status });

    const user = (await User.findOne()) || { threshold: 0.7, emergencyContact: process.env.EMERGENCY_EMAIL };
    const highRisk = isHighRisk(confidence, user.threshold);

    if (highRisk) {
      await Event.create({
        deviceId,
        riskLevel: confidence,
        status: "High Risk",
        message: "Driver may be intoxicated or unsafe",
      });

      const notifyTo = user.emergencyContact || process.env.EMERGENCY_EMAIL;
      if (process.env.MAIL_USER && notifyTo) {
        try {
          await sendEmail({
            to: notifyTo,
            subject: "High Risk Driver Alert",
            text: `Driver risk level is ${confidence}. Immediate attention required.`,
          });
        } catch (e) {
          // Soft-fail email errors
          console.warn("Email send failed:", e.message);
        }
      }
    }

    return res.json({ success: true, detection, highRisk });
  } catch (error) {
    console.error("receiveDetection error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
