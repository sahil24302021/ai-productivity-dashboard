import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  OPENAI_API_KEY: z.string().optional(),
  CORS_WHITELIST: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid env:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
