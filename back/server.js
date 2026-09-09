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


      // Delete old admin@gmail.com if present
      await LocalUser.deleteOne({ email: "admin@gmail.com" });

      // Seed Super Admin: odedraarjun928@gmail.com / admin123
      let superAdmin = await LocalUser.findOne({
        $or: [
          { email: "odedraarjun928@gmail.com" },
          { userId: "ADMIN001" },
          { userId: "ODEDRAARJUN928" }
        ]
      });

      const hashedPassword = await bcrypt.hash("admin123", 10);

      if (!superAdmin) {
        const userData = {
          name: "Arjun Odedra (Super Admin)",
          userId: "ADMIN001",
          email: "odedraarjun928@gmail.com",
          password: hashedPassword,
          role: "SUPER_ADMIN",
          isSynced: false,
          lastSyncedAt: new Date(),
        };

        await LocalUser.create(userData);
        await syncAfterLocalSave(userData, "user");
        console.log("Super Admin odedraarjun928@gmail.com Created");
      } else {
        superAdmin.name = "Arjun Odedra (Super Admin)";
        superAdmin.email = "odedraarjun928@gmail.com";
        superAdmin.password = hashedPassword;
        superAdmin.role = "SUPER_ADMIN";
        await superAdmin.save();
        console.log("Super Admin odedraarjun928@gmail.com Updated");
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