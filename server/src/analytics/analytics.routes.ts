import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getOverviewHandler, aiSummaryHandler } from "./analytics.controller";

const router = Router();

router.use(authMiddleware);

router.get("/overview", getOverviewHandler);
router.post("/ai-summary", aiSummaryHandler);

export default router;
