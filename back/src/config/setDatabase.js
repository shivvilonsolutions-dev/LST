import mongoose
  from "mongoose";

import envConfig
  from "./envConfig.js";


let localConnection =
  null;

let atlasConnection =
  null;

let currentUserId =
  "ADMIN001";

const buildDbUri = (baseUri, newDbName) => {
  if (!baseUri) {
    return `mongodb://127.0.0.1:27017/${newDbName}`;
  }
  return baseUri.replace(/\/([^/?]+)(\?|$)/, `/${newDbName}$2`);
};


export const connectUserDatabases =
  async (userId) => {

    // ALREADY CONNECTED TO SAME USER DB
    if (
      currentUserId === userId &&
      localConnection &&
      atlasConnection
    ) {

      return {

        localConnection,

        atlasConnection,
      };
    }

    currentUserId =
      userId;

    try {

      // DISCONNECT OLD LOCAL
      if (localConnection) {
        await localConnection.close();
      }

      const localDbName = `lst_local_${userId}`;
      const localUri = buildDbUri(
        envConfig.LOCAL_MONGO_URI,
        localDbName
      );

      // Centralized shared Atlas URI (all users sync to shared database)
      const atlasUri = envConfig.ATLAS_MONGO_URI;

      localConnection = mongoose.createConnection(localUri);

      localConnection.on("connected", () => {
        console.log(`Local DB Connected: ${localDbName}`);
      });

      localConnection.on("error", (err) => {
        console.error("Local Connection Error:", err.message);
      });

      // Keep existing Atlas connection if already alive
      if (atlasConnection && atlasConnection.readyState === 1) {
        return {
          localConnection,
          atlasConnection,
        };
      }

      // Connect to shared Atlas if configured
      if (
        envConfig.ATLAS_MONGO_URI &&
        envConfig.ATLAS_MONGO_URI !== "mongodb://127.0.0.1:27017/lst_atlas"
      ) {
        try {
          atlasConnection = mongoose.createConnection(atlasUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            ssl: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
          });

          atlasConnection.on("connected", () => {
            console.log("Atlas Central DB Connected: lst");
          });

          atlasConnection.on("error", (err) => {
            console.error("Atlas Connection Error:", err.message);
          });
        } catch (err) {
          console.log("Atlas connection failed to initialize:", err.message);
          atlasConnection = null;
        }
      } else {
        console.log("Atlas URI not configured - skipping Atlas connection");
        atlasConnection = null;
      }

      return {
        localConnection,
        atlasConnection,
      };
    }

    catch (error) {

      console.log(
        "Dynamic DB Connection Failed"
      );

      console.log(error);

      throw error;
    }
  };


export const getConnections =
  () => {

    return {

      localConnection,

      atlasConnection: atlasConnection || null,
    };
  };

export const getCurrentUserId =
  () => {

    return currentUserId;
  };