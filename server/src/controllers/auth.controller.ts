import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.signup(email, password);

  return res.status(201).json(result); // { token, user }
    } catch (err) {
  return res.status(400).json({ error: "Signup failed" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

  if (!result) return res.status(401).json({ error: "Invalid credentials" });
  return res.status(200).json(result); // { token, user }
    } catch (err) {
  return res.status(400).json({ error: "Login failed" });
    }
  }
}
