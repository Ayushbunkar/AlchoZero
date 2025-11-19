import { createEvent } from '../services/eventService.js';
import { findUserById, listUsers } from '../services/userService.js';
import sendEmail from "../utils/sendEmail.js";
import { isHighRisk } from "../utils/validateThreshold.js";

export const receiveDetection = async (req, res) => {
  try {
    const { deviceId, confidence, status } = req.body || {};

    if (typeof confidence !== "number" || confidence < 0 || confidence > 1) {
      return res.status(400).json({ success: false, message: "Invalid confidence" });
    }

    // Get user for threshold check
    const users = await listUsers({ limit: 1 });
    const user = users[0] || { threshold: 0.7, emergencyContact: process.env.EMERGENCY_EMAIL };
    const highRisk = isHighRisk(confidence, user.threshold);

    // Create event with detection data
    const event = await createEvent({
      deviceId,
      riskLevel: confidence >= 0.8 ? 'critical' : confidence >= 0.6 ? 'high' : confidence >= 0.3 ? 'medium' : 'low',
      detectedValue: confidence,
      metadata: { 
        status: highRisk ? "High Risk" : status || "Normal",
        message: highRisk ? "Driver may be intoxicated or unsafe" : "Detection received"
      }
    });

    if (highRisk) {
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

    return res.json({ success: true, detection: event, highRisk });
  } catch (error) {
    console.error("receiveDetection error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
