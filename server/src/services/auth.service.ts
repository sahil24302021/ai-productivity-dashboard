import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class AuthService {
  static async signup(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
  }
}
