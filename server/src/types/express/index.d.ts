import { User } from "@prisma/client";
declare global {
  namespace Express {
    interface UserPayload { id: string; email?: string; }
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
export {};
