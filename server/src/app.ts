import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import kanbanRoutes from "./routes/kanban";
import aiRoutes from "./routes/ai.route";
import legacyAnalyticsRoutes from "./routes/analytics";
import analyticsModuleRoutes from "./analytics/analytics.routes";
import healthRoutes from "./routes/health";
import calendarRoutes from "./routes/calendar";
import dotenv from "dotenv";
dotenv.config();
import { env } from "./config/env";
import logger from "./utils/logger";
import { errorHandler } from "./middlewares/error.middleware";


const app = express();

// Security
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
    crossOriginResourcePolicy: { policy: "same-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
  })
);

// CORS configuration
const whitelist = env.CORS_WHITELIST
  ? env.CORS_WHITELIST
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];
app.use(
  cors({
    origin: (origin, cb) => {
  if (env.NODE_ENV !== "production") return cb(null, true);
      if (!origin) return cb(null, true); // allow tools like Postman
      if (whitelist.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Logging
app.use(morgan("tiny"));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });
app.use(limiter);
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
// Mount legacy analytics routes (if any) and the new analytics module
app.use("/api/analytics", legacyAnalyticsRoutes);
app.use("/api/analytics", analyticsModuleRoutes);
app.use("/api/ai", aiRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/kanban", kanbanRoutes);
  app.use("/api/calendar", calendarRoutes);
app.use("/api", healthRoutes);

// Error handler
app.use(errorHandler);

export default app;
