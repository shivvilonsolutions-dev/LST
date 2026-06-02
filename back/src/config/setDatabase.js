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

const buildDbUri =
  (
    baseUri,
    newDbName
  ) => {

    return baseUri.replace(

      /\/([^/?]+)(\?|$)/,

      `/${newDbName}$2`
    );
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

      // DISCONNECT OLD
      if (localConnection) {

        await localConnection.close();
      }

      if (atlasConnection) {

        await atlasConnection.close();
      }

      const localDbName =
        `lst_local_${userId}`;


      const atlasDbName =
        `lst_atlas_${userId}`;


      const localUri =
        buildDbUri(

          envConfig.LOCAL_MONGO_URI,

          localDbName
        );


      const atlasUri =
        buildDbUri(

          envConfig.ATLAS_MONGO_URI,

          atlasDbName
        );


      localConnection =
        mongoose.createConnection(
          localUri
        );


      atlasConnection =
        mongoose.createConnection(
          atlasUri
        );


      localConnection.on(
        "connected",

        () => {

          console.log(
            `Local DB Connected: ${localDbName}`
          );
        }
      );


      atlasConnection.on(
        "connected",

        () => {

          console.log(
            `Atlas DB Connected: ${atlasDbName}`
          );
        }
      );


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

      atlasConnection,
    };
  };

export const getCurrentUserId =
  () => {

    return currentUserId;
  };