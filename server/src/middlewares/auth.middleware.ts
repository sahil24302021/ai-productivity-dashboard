import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Unauthorized" });
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    (req as any).user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

