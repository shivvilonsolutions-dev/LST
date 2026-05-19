import app from "./app.js";

import envConfig
from "./config/envConfig.js";

import startSyncJob
from "./jobs/syncJob.js";

// INITIALIZE DB CONNECTIONS

import "./config/localDb.js";
import "./config/atlasDb.js";

const PORT = envConfig.PORT || 5000;


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

    } catch (error) {

      console.log(
        "Server Startup Failed"
      );

      console.log(error);
    }
  };

startServer();