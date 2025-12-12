import app from "./app";
import { prisma } from "./prisma";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to Prisma
    await prisma.$connect();
    console.log("✅ Prisma connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // Start reminder scheduler AFTER server starts (production only)
    if (process.env.NODE_ENV === "production") {
      import("./scheduler/reminderScheduler").then((m) => {
        // Support both default export and named export
        if (typeof (m as any).default === "function") {
          (m as any).default();
        } else if (typeof (m as any).startReminderScheduler === "function") {
          (m as any).startReminderScheduler();
        }
      });
    } else {
      console.log("⏳ Scheduler disabled in development");
    }

    // Graceful shutdown
  const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`\nReceived ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("🛑 Server closed. Prisma disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
