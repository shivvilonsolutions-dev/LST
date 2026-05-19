import mongoose from "mongoose";
import envConfig
from "./envConfig.js";

const atlasConnection =
  mongoose.createConnection(
    envConfig.ATLAS_MONGO_URI, 
  );

atlasConnection.on(
  "connected",
  () => {

    console.log(
      "MongoDB Atlas Connected Successfully!"
    );
  }
);

atlasConnection.on(
  "error",
  (err) => {

    console.log(
      "Atlas MongoDB Error:",
      err
    );
  }
);

export default atlasConnection;