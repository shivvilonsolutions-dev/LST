import fs from "fs";
import path from "path";
import os from "os";

const configDir = () =>
  path.join(os.homedir(), "Documents", "LST_Local_Files");

const configPath = () => path.join(configDir(), "cloud-sync.json");

export const getSavedAtlasUri = () => {
  try {
    const filePath = configPath();
    if (!fs.existsSync(filePath)) return "";
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return String(data.atlasMongoUri || "").trim();
  } catch {
    return "";
  }
};

export const saveCloudSyncUri = (uri) => {
  const dir = configDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    configPath(),
    JSON.stringify({ atlasMongoUri: String(uri || "").trim() }, null, 2),
    "utf8"
  );
};

export const isUsableAtlasUri = (uri) => {
  const value = String(uri || "").trim();
  return value.startsWith("mongodb") && !value.includes("****");
};

export const maskMongoUri = (uri) => {
  const value = String(uri || "").trim();
  if (!value) return "";
  return value.replace(/:([^:@/]+)@/, ":****@");
};
