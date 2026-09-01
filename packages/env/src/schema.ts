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

  R2_ENDPOINT: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET_NAME: z.string().min(1).optional(),
  R2_PUBLIC_URL: z.string().url().optional(),

  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
