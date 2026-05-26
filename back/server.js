import app from "./src/app.js";
import bcrypt from "bcryptjs";
import fs from "fs";

import envConfig from "./src/config/envConfig.js";
import startSyncJob from "./src/jobs/syncJob.js";
// DYNAMIC DB CONNECTIONS

import {
  connectUserDatabases,
} from "./src/config/setDatabase.js";


// DYNAMIC MODELS
import getModels from "./src/models/getModels.js";


const PORT =
  envConfig.PORT || 5000;


console.log(
  "Email sender in server.js:",
  envConfig.EMAIL_USER
);


// CREATE DEFAULT ADMIN
const seedDefaultUser =
  async () => {

    try {

      // CONNECT DEFAULT ADMIN DB

      await connectUserDatabases(
        "ADMIN001"
      );


      const {

        LocalUser,

        LocalSettings,

      } = getModels();


      const existingUser =
        await LocalUser.findOne({

          email:
            "admin@gmail.com",
        });


      if (!existingUser) {

        const hashedPassword =
          await bcrypt.hash(

            "admin123",

            10
          );


        const userData = {

          name:
            "Admin",

          userId:
            "ADMIN001",

          email:
            "admin@gmail.com",

          password:
            hashedPassword,

          isSynced:
            true,

          lastSyncedAt:
            new Date(),
        };


        // CREATE ADMIN USER

        await LocalUser.create(
          userData
        );


        console.log(
          "Default Admin Created"
        );
      }

      else {

        console.log(
          "Default Admin Already Exists"
        );
      }


      // DEFAULT STORAGE PATH

      const defaultStoragePath =
        "D:\\LST_Local_Files\\ADMIN001";


      // CREATE ROOT FOLDER

      if (
        !fs.existsSync(
          defaultStoragePath
        )
      ) {

        fs.mkdirSync(

          defaultStoragePath,

          {
            recursive: true,
          }
        );
      }


      // CREATE DEFAULT SETTINGS

      await LocalSettings.findOneAndUpdate(

        {},

        {

          offlinePdfPath:
            defaultStoragePath,

          isSynced: false,
        },

        {

          upsert: true,

          new: true,
        }
      );


      console.log(
        "Admin Settings Ready"
      );

    }

    catch (error) {

      console.log(
        "Default User Seed Failed"
      );

      console.log(error);
    }
  };


// START SERVER

const startServer =
  async () => {

    try {

      // CREATE DEFAULT ADMIN DB + USER

      await seedDefaultUser();


      app.listen(

        PORT,

        () => {

          console.log(
            `Server running on port ${PORT}`
          );

          startSyncJob();
        }
      );

    }

    catch (error) {

      console.log(
        "Server Startup Failed"
      );

      console.log(error);
    }
  };


startServer();