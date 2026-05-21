import app from "./src/app.js";

import envConfig
  from "./src/config/envConfig.js";

import startSyncJob
  from "./src/jobs/syncJob.js";


// INITIALIZE DB CONNECTIONS

import "./src/config/localDb.js";

import "./src/config/atlasDb.js";


// DEFAULT USER SEED

import User
  from "./src/models/local/User.js";

import bcrypt
  from "bcryptjs";


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

      const existingUser =
        await User.findOne({

          email:
            "admin@gmail.com"
        });

      if (!existingUser) {

        const hashedPassword =
          await bcrypt.hash(
            "admin123",
            10
          );

        await User.create({

          email:
            "admin@gmail.com",

          password:
            hashedPassword,

          role: "admin"
        });

        console.log(
          "Default Admin Created"
        );
      }

    } catch (error) {

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
