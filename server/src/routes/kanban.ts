import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { reorderController, moveController } from "../controllers/kanban.controller";

const router = Router();
router.use(authMiddleware);

router.put("/reorder", reorderController);
router.put("/move", moveController);

export default router;
