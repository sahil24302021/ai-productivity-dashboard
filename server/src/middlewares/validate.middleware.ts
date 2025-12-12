// src/middlewares/validate.middleware.ts

import { ZodTypeAny, ZodIssue } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Generic Zod validation middleware
 * Supports:
 *  - body
 *  - params
 *  - query
 */
export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate incoming data
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      // Format error messages
      const issues = result.error.issues.map((issue: ZodIssue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        issues,
      });
    }

    // If validation is successful, continue
    next();
  };
};
