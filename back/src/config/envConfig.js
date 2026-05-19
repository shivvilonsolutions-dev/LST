import dotenv from "dotenv";
dotenv.config();

const envConfig = {

  PORT: process.env.PORT,

  LOCAL_MONGO_URI: process.env.LOCAL_MONGO_URI,

  ATLAS_MONGO_URI: process.env.ATLAS_MONGO_URI,
};

export default envConfig;