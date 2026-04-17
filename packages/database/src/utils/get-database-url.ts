import { env } from "@dniproanimals/env";

export function getDatabaseUrl(): string {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  return `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
}
