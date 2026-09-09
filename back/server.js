import app from "./src/app.js";
import bcrypt from "bcryptjs";
import fs from "fs";

import envConfig from "./src/config/envConfig.js";
import startSyncJob from "./src/jobs/syncJob.js";
import { syncAfterLocalSave } from "./src/services/syncService.js";

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
          email: "admin@gmail.com",
        });

      if (!existingUser) {
        const hashedPassword =
          await bcrypt.hash(
            "admin123",
            10
          );

        const userData = {
          name: "Super Admin",
          userId: "ADMIN001",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "SUPER_ADMIN",
          isSynced: false,
          lastSyncedAt: new Date(),
        };

        await LocalUser.create(userData);
        await syncAfterLocalSave(userData, "user");
        console.log("Default Super Admin Created");
      } else {
        if (existingUser.role !== "SUPER_ADMIN") {
          existingUser.role = "SUPER_ADMIN";
          await existingUser.save();
        }
        console.log("Default Super Admin Already Exists");
      }

      // Seed default Admin: odedraarjun928@gmail.com / arjun123
      const existingArjunAdmin = await LocalUser.findOne({
        email: "odedraarjun928@gmail.com",
      });

      if (!existingArjunAdmin) {
        const hashedArjunPass = await bcrypt.hash("arjun123", 10);
        const arjunData = {
          name: "Arjun Odedra",
          userId: "ODEDRAARJUN928",
          email: "odedraarjun928@gmail.com",
          password: hashedArjunPass,
          role: "ADMIN",
          isSynced: false,
          lastSyncedAt: new Date(),
        };

        await LocalUser.create(arjunData);
        await syncAfterLocalSave(arjunData, "user");
        console.log("Admin account odedraarjun928@gmail.com created");
      }


      // DEFAULT STORAGE PATH
      const defaultStoragePath =
        "D:\\LST_Local_Files";


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

      await new Promise((resolve, reject) => {
        const server = app.listen(PORT, "127.0.0.1", () => {
          console.log(`Server running on port ${PORT}`);
          resolve(server);
        });
        server.on("error", reject);
      });

      await seedDefaultUser();
      startSyncJob();

    }

    catch (error) {

      console.log(
        "Server Startup Failed"
      );

      console.log(error);
    }
  };


startServer();