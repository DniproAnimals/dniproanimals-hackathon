import dotenv from "dotenv";
import findUp from "find-up";

const envPath = findUp.sync(".env");

if (!envPath) throw new Error(".env not found");

dotenv.config({ path: envPath });
