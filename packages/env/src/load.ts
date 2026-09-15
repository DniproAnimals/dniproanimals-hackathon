import dotenv from "dotenv";
import findUp from "find-up";

const envPath = findUp.sync(".env");

if (envPath) {
  dotenv.config({ path: envPath });
}
