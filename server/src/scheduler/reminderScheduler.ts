import cron from "node-cron";
import prisma from "../prisma";
import logger from "../utils/logger";

let running = false;

export function startReminderScheduler() {
  // Run every 60 seconds
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    const run = async (attempt = 1) => {
      try {
        const tasks = await prisma.task.findMany({
          where: { reminderAt: { lte: now }, status: { not: "done" } },
          select: { id: true },
        });

        for (const t of tasks) {
          logger.info(`[REMINDER] Task reminder triggered: ${t.id}`);
          await prisma.task.update({ where: { id: t.id }, data: { reminderAt: null } });
        }
      } catch (err: any) {
        if (attempt < 3) {
          const backoffMs = 1000 * attempt;
          logger.error("Reminder scheduler error, retrying", { attempt, backoffMs, error: err?.message });
          setTimeout(() => run(attempt + 1), backoffMs);
        } else {
          logger.error("Reminder scheduler failed after retries", { error: err });
        }
      }
    };
    if (running) {
      logger.warn("Reminder scheduler skipped: already running");
      return;
    }
    running = true;
    try {
      await run();
    } finally {
      running = false;
    }
  });
}
