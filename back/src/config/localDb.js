import mongoose from "mongoose";
import envConfig
from "./envConfig.js";

const localConnection =
  mongoose.createConnection(
    envConfig.LOCAL_MONGO_URI
  );

localConnection.on(
  "connected",
  () => {

    console.log(
      "Local MongoDB Connected Successfully!"
    );
  }
);

localConnection.on(
  "error",
  (err) => {

    console.log(
      "Local MongoDB Error:",
      err
    );
  }
);

export default localConnection;