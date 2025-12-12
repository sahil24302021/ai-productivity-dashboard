import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  try {
  req.body = parsed.data;
  return AuthController.signup(req, res);
  } catch (err: any) {
  return res.status(500).json({ error: err.message ?? "Signup failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  try {
  req.body = parsed.data;
  return AuthController.login(req, res);
  } catch (err: any) {
  return res.status(500).json({ error: err.message ?? "Login failed" });
  }
});

export default router;

// Token verification
router.get("/verify", authMiddleware, (req, res) => {
  return res.status(200).json({ ok: true });
});
