import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let status = err?.status || 500;
  let message = err?.message || "Internal Server Error";

  if (err instanceof PrismaClientKnownRequestError) {
    // Map common Prisma errors
    if (err.code === "P2002") {
      status = 409;
      message = "Unique constraint violation";
    } else if (err.code === "P2024") {
      status = 503;
      message = "Database connection timeout";
    } else if (err.code === "P1017") {
      status = 503;
      message = "Database connection closed unexpectedly";
    }
  }

  res.status(status).json({ error: message });
};
