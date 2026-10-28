import {
  syncPendingData,
  pullDataFromAtlas,
} from "../services/syncService.js";
import getModels from "../models/getModels.js";
import checkInternet from "../utils/checkInternet.js";

const SYNC_TIME_IN_SEC = 60;

const runSyncCycle = async () => {
  try {
    const isOnline = await checkInternet();
    if (!isOnline) {
      return;
    }

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

    if (!AtlasClient || !AtlasInventory || !AtlasQuotation) {
      return;
    }

    console.log(
      `[${new Date().toLocaleTimeString("en-IN")}] Running silent background sync...`
    );

    // 1. PUSH: Send unsynced local data to Atlas
    await syncPendingData(LocalClient, AtlasClient, "cliId");
    await syncPendingData(LocalInventory, AtlasInventory, "inventoryId");
    await syncPendingData(LocalQuotation, AtlasQuotation, "quotationNo");
    await syncPendingData(LocalSettings, AtlasSettings, "_id");
    await syncPendingData(LocalUser, AtlasUser, "email");

    // 2. PULL: Fetch any quotations/clients created on other client PCs into this local DB
    await pullDataFromAtlas(LocalQuotation, AtlasQuotation, "quotationNo");
    await pullDataFromAtlas(LocalClient, AtlasClient, "cliId");
    await pullDataFromAtlas(LocalInventory, AtlasInventory, "inventoryId");
    await pullDataFromAtlas(LocalUser, AtlasUser, "email");

  } catch (error) {
    console.log("Background Sync Job Error:", error.message);
  }
};

const startSyncJob = () => {
  // First run shortly after app starts
  setTimeout(() => {
    runSyncCycle();
  }, 5000);

  // Periodic recurring background sync
  setInterval(async () => {
    await runSyncCycle();
  }, 1000 * SYNC_TIME_IN_SEC);
};

export default startSyncJob;

