import {
  syncPendingData,
} from "../services/syncService.js";

import LocalClient from "../models/local/Client.js";
import LocalInventory from "../models/local/Inventory.js";
import LocalQuotation from "../models/local/Quotation.js";
import LocalSettings from "../models/local/Settings.js";

import AtlasClient from "../models/atlas/Client.js";
import AtlasInventory from "../models/atlas/Inventory.js";
import AtlasQuotation from "../models/atlas/Quotation.js";
import AtlasSettings from "../models/atlas/Settings.js";

const SYNC_TIME_IN_SEC = 30

const startSyncJob =
  () => {

    setInterval(
      async () => {

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

        } catch (error) {

          console.log(
            "Sync Job Error:",
            error
          );
        }

      },

      1000*SYNC_TIME_IN_SEC  // Every given seconds, it checks for syncing and internet connection
    );
  };

export default startSyncJob;