import dotenv from "dotenv";

import path from "path";


const envPath = process.resourcesPath

  ? path.join(
      process.resourcesPath,
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