import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./shared/config/env";
import { errorMiddleware } from "./shared/middleware/error.middleware";

// Module routers
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import providerRoutes from "./modules/providers/provider.routes";
import serviceRoutes from "./modules/services/service.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import adminRoutes from "./modules/admin/admin.routes";

const app = express();

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "SevaSetu API is running 🚀" });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API = "/api/v1";

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/providers`, providerRoutes);
app.use(`${API}/services`, serviceRoutes);
app.use(`${API}/bookings`, bookingRoutes);
app.use(`${API}/reviews`, reviewRoutes);
app.use(`${API}/admin`, adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found", data: null });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
