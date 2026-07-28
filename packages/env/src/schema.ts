import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(55432),
  DB_USER: z.string().default("postgres"),
  DB_PASS: z.string().default("postgres"),
  DB_NAME: z.string().default("dniproanimals"),

  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),

  SESSION_SECRET: z.string().min(10).default("dev-secret-change-me-please"),

  SERVER_PORT: z.coerce.number().default(3001),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001"),

  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@dniproanimals.local"),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),

  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
