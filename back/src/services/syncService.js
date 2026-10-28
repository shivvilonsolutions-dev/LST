import getModels from "../models/getModels.js";
import checkInternet from "../utils/checkInternet.js"

const syncDocument =
  async (
    localDoc,
    AtlasModel,
    uniqueField
  ) => {

    // Skip sync if Atlas is not configured
    if (!AtlasModel) {
      console.log("Atlas not configured, skipping sync");
      return;
    }

    console.log(`Syncing document ${uniqueField}: ${localDoc[uniqueField]}`);

    const existing =
      await AtlasModel.findOne({
        [uniqueField]:
          localDoc[uniqueField],
      });

    if (!existing) {

      console.log(`Creating new document in Atlas for ${uniqueField}: ${localDoc[uniqueField]}`);
      await AtlasModel.create(
        localDoc.toObject()
      );

    } else {

      console.log(`Updating existing document in Atlas for ${uniqueField}: ${localDoc[uniqueField]}`);
      await AtlasModel.findOneAndUpdate(
        {
          [uniqueField]:
            localDoc[uniqueField],
        },

        localDoc.toObject(),

        {
          returnDocument:
            "after",
        }
      );
    }

    localDoc.isSynced = true;

    localDoc.lastSyncedAt =
      new Date();

    await localDoc.save();

    console.log(`Sync completed for ${uniqueField}: ${localDoc[uniqueField]}`);
  };

export const syncPendingData =
  async (
    LocalModel,
    AtlasModel,
    uniqueField
  ) => {
    if (!LocalModel || !AtlasModel) return;

    try {
      const unsyncedDocs =
        await LocalModel.find({
          isSynced: false,
        });

      for (const doc of unsyncedDocs) {
        await syncDocument(
          doc,
          AtlasModel,
          uniqueField
        );
      }
    } catch (err) {
      console.log(`syncPendingData failed for ${uniqueField}:`, err.message);
    }
  };

export const pullDataFromAtlas =
  async (
    LocalModel,
    AtlasModel,
    uniqueField
  ) => {
    if (!LocalModel || !AtlasModel) return;

    try {
      const atlasDocs = await AtlasModel.find({}).lean();
      if (!atlasDocs || atlasDocs.length === 0) return;

      for (const remoteDoc of atlasDocs) {
        const uniqueVal = remoteDoc[uniqueField];
        if (!uniqueVal) continue;

        const localDoc = await LocalModel.findOne({ [uniqueField]: uniqueVal });

        if (!localDoc) {
          const docToInsert = { ...remoteDoc, isSynced: true, lastSyncedAt: new Date() };
          delete docToInsert._id;
          try {
            await LocalModel.create(docToInsert);
            console.log(`Pulled new ${uniqueField} from cloud: ${uniqueVal}`);
          } catch (insertErr) {
            console.log(`Insert failed for ${uniqueVal}:`, insertErr.message);
          }
        } else {
          // If local already exists and is marked synced, update if remote is newer
          const remoteTime = new Date(remoteDoc.updatedAt || remoteDoc.lastSyncedAt || 0).getTime();
          const localTime = new Date(localDoc.updatedAt || localDoc.lastSyncedAt || 0).getTime();

          if (remoteTime > localTime && localDoc.isSynced !== false) {
            const docToUpdate = { ...remoteDoc, isSynced: true, lastSyncedAt: new Date() };
            delete docToUpdate._id;
            try {
              await LocalModel.findOneAndUpdate(
                { [uniqueField]: uniqueVal },
                docToUpdate
              );
              console.log(`Updated local ${uniqueField} from cloud: ${uniqueVal}`);
            } catch (updateErr) {
              console.log(`Update failed for ${uniqueVal}:`, updateErr.message);
            }
          }
        }
      }
    } catch (err) {
      console.log(`pullDataFromAtlas failed for ${uniqueField}:`, err.message);
    }
  };

export const syncAfterLocalSave =
  async (
    localDoc,
    type
  ) => {

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

    // Use setTimeout to run sync in background after main operation completes
    // Small delay (100ms) ensures main save operation completes first
    setTimeout(async () => {
      try {

        const isOnline = await checkInternet();

        if (!isOnline) {
          console.log(
            "Offline Mode - Stored Locally"
          );
          return;
        }

        console.log(
          "Internet Available - Background Sync Started"
        );

        // SYNC CURRENT DOCUMENT
        if (type === "client") {

          await syncDocument(
            localDoc,
            AtlasClient,
            "cliId"
          );
        }

        if (type === "inventory") {

          await syncDocument(
            localDoc,
            AtlasInventory,
            "inventoryId"
          );
        }

        if (type === "quotation") {

          await syncDocument(
            localDoc,
            AtlasQuotation,
            "quotationNo"
          );
        }

        if (type === "settings") {

          await syncDocument(
            localDoc,
            AtlasSettings,
            "_id"
          );
        }

        if (type === "user") {

          await syncDocument(
            localDoc,
            AtlasUser,
            "email"
          );
        }

        console.log(
          "Background Sync Successful"
        );

      } catch (error) {

        console.log(
          "Background Sync Error:",
          error
        );
      }
    }, 100); // 100ms delay to let main operation complete
  };