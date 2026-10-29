import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleEnvPaths = [
  process.resourcesPath ? path.join(process.resourcesPath, "back", ".env") : null,
  process.resourcesPath ? path.join(process.resourcesPath, ".env") : null,
  path.join(process.cwd(), "back", ".env"),
  path.join(process.cwd(), ".env"),
  path.join(__dirname, "../../../.env"),
  path.join(__dirname, "../../.env"),
].filter(Boolean);

const envPath = possibleEnvPaths.find((p) => fs.existsSync(p)) || possibleEnvPaths[0];

if (envPath && fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log("Loaded ENV from:", envPath);
} else {
  dotenv.config();
  console.log("Loaded default ENV (no specific file found)");
}

const envConfig = {
  PORT: process.env.PORT || 5000,
  LOCAL_MONGO_URI: process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/lst_local",
  ATLAS_MONGO_URI: process.env.ATLAS_MONGO_URI || "mongodb+srv://shivvilonsolutions_db_user:SLPyWcPpOYg6Jysx@cluster0.bt8izdt.mongodb.net/lst?retryWrites=true&w=majority",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretjwtkey12345",
};

// Guarantee process.env has the fallbacks as well
process.env.JWT_SECRET = envConfig.JWT_SECRET;
process.env.PORT = String(envConfig.PORT);
process.env.LOCAL_MONGO_URI = envConfig.LOCAL_MONGO_URI;
process.env.ATLAS_MONGO_URI = envConfig.ATLAS_MONGO_URI;

export default envConfig;
