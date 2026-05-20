import app from "./src/app.js";

import envConfig from "./src/config/envConfig.js";
import startSyncJob from "./src/jobs/syncJob.js";


// INITIALIZE DB CONNECTIONS

import "./src/config/localDb.js";
import "./src/config/atlasDb.js";


const PORT = envConfig.PORT || 5000;


console.log(
  "Email sender in server.js:",
  envConfig.EMAIL_USER
);


const startServer =
  async () => {

    try {

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