import dotenv from "dotenv";

import path from "path";

import { app } from "electron";

const envPath = process.versions.electron

    ? app.isPackaged

        ? path.join(
            process.resourcesPath,
            "back",
            ".env"
          )

        : path.join(
            process.cwd(),
            "back",
            ".env"
          )

    : path.join(
        process.cwd(),
        ".env"
      );

dotenv.config({
    path: envPath
});

console.log(
    "Loaded ENV from:",
    envPath
);

const envConfig = {

  PORT:
    process.env.PORT,

  LOCAL_MONGO_URI:
    process.env.LOCAL_MONGO_URI,

  ATLAS_MONGO_URI:
    process.env.ATLAS_MONGO_URI,

  EMAIL_USER:
    process.env.EMAIL_USER,

  EMAIL_PASS:
    process.env.EMAIL_PASS,

  JWT_SECRET:
    process.env.JWT_SECRET
};


export default
  envConfig;