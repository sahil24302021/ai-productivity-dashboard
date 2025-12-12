import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

/* ---------------------------
   ZOD VALIDATION SCHEMAS
---------------------------- */

// Schema for creating a task
const createSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  }),
});

// Schema for updating a task
const updateSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  }),
});

// Schema for validating ":id" param
const idSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
});

/* ---------------------------
   ROUTES
---------------------------- */

router.post("/", validate(createSchema), TaskController.createTask);

router.get("/", TaskController.getTasks);

router.put("/:id", validate(updateSchema), TaskController.updateTask);

router.delete("/:id", validate(idSchema), TaskController.deleteTask);

export default router;
