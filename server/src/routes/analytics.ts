import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { taskCounts, statusBreakdown, productivityScore, dailyActivity } from "../controllers/analyticsController";

const router = Router();
router.use(authMiddleware);

router.get("/task-counts", taskCounts);
router.get("/status-breakdown", statusBreakdown);
router.get("/productivity-score", productivityScore);
router.get("/daily-activity", dailyActivity);

export default router;
