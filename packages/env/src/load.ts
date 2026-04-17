import dotenv from "dotenv";
import findUp from "find-up";
import { envSchema } from "./schema";

const envPath = findUp.sync(".env");

if (!envPath) throw new Error(".env not found");

dotenv.config({ path: envPath });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "\u274C Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}
