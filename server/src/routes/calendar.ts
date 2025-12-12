import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createCalendarTask, listTasksByDateRange, listUpcoming, listOverdue } from "../controllers/calendar.controller";

const router = Router();
router.use(authMiddleware);

// POST /api/calendar/tasks
router.post("/tasks", createCalendarTask);
// GET /api/calendar/tasks?from=&to=
router.get("/tasks", listTasksByDateRange);
// GET /api/calendar/upcoming
router.get("/upcoming", listUpcoming);
// GET /api/calendar/overdue
router.get("/overdue", listOverdue);

export default router;
