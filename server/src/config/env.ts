import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),
  JWT_SECRET: z.string().min(10, { message: "JWT_SECRET must be at least 10 characters" }),
  PORT: z.coerce.number().default(5000),
  CORS_WHITELIST: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = schema.parse(process.env);