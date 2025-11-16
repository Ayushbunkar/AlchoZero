import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS configuration: allow Vite dev and any configured origins
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const envOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) and allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Preflight for all routes
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

app.use("/api/detection", detectionRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.get("/", (req, res) => {
  res.send("Drunk Driving Detection Backend Running 🚗");
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
