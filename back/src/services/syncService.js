import getModels from "../models/getModels.js";
import checkInternet from "../utils/checkInternet.js"

const syncDocument =
  async (
    localDoc,
    AtlasModel,
    uniqueField
  ) => {

    const existing =
      await AtlasModel.findOne({
        [uniqueField]:
          localDoc[uniqueField],
      });

    if (!existing) {

      await AtlasModel.create(
        localDoc.toObject()
      );

    } else {

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
  };

export const syncPendingData =
  async (
    LocalModel,
    AtlasModel,
    uniqueField
  ) => {

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

    try {

      const isOnline = await checkInternet();

      if (!isOnline) {
        console.log(
          "Offline Mode - Stored Locally"
        );
        return;
      }

      console.log(
        "Internet Available"
      );

      // SYNC OLDER DATA FIRST
      if (type === "client") {

        await syncPendingData(
          LocalClient,
          AtlasClient,
          "cliId"
        );

        await syncDocument(
          localDoc,
          AtlasClient,
          "cliId"
        );
      }

      if (type === "inventory") {

        await syncPendingData(
          LocalInventory,
          AtlasInventory,
          "inventoryId"
        );

        await syncDocument(
          localDoc,
          AtlasInventory,
          "inventoryId"
        );
      }

      if (type === "quotation") {

        await syncPendingData(
          LocalQuotation,
          AtlasQuotation,
          "quotationNo"
        );

        await syncDocument(
          localDoc,
          AtlasQuotation,
          "quotationNo"
        );
      }

      if (type === "settings") {

        await syncPendingData(
          LocalSettings,
          AtlasSettings,
          "_id"
        );

        await syncDocument(
          localDoc,
          AtlasSettings,
          "_id"
        );
      }

      if (type === "user") {

        await syncPendingData(
          LocalUser,
          AtlasUser,
          "email"
        );

        await syncDocument(
          localDoc,
          AtlasUser,
          "email"
        );
      }

      console.log(
        "Sync Successful"
      );

    } catch (error) {

      console.log(
        "Sync Error:",
        error
      );
    }
  };