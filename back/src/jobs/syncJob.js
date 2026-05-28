import {
  syncPendingData,
} from "../services/syncService.js";
import getModels from "../models/getModels.js";

const SYNC_TIME_IN_SEC = 90

const startSyncJob =
  () => {

    setInterval(
      async () => {

        const {

          LocalClient,
          LocalInventory,
          LocalQuotation,
          LocalSettings,
          LocalUser,

          AtlasClient,
          AtlasInventory,
          AtlasQuotation,
          AtlasSettings,
          AtlasUser,

        } = getModels();

        try {

          console.log(
            `[${new Date().toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }
            )}] Retrying Pending Syncs...`
          );

          await syncPendingData(
            LocalClient,
            AtlasClient,
            "cliId"
          );

          await syncPendingData(
            LocalInventory,
            AtlasInventory,
            "inventoryId"
          );

          await syncPendingData(
            LocalQuotation,
            AtlasQuotation,
            "quotationNo"
          );

          await syncPendingData(
            LocalSettings,
            AtlasSettings,
            "_id"
          );

          await syncPendingData(
            LocalUser,
            AtlasUser,
            "email"
          );

        } catch (error) {

          console.log(
            "Sync Job Error:",
            error
          );
        }

      },

      1000 * SYNC_TIME_IN_SEC  // Every given seconds, it checks for syncing and internet connection
    );
  };

export default startSyncJob;