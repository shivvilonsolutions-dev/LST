import checkInternet from "../utils/checkInternet.js";
import LocalSettings from "../models/local/Settings.js";
import AtlasClient from "../models/atlas/Client.js";
import AtlasInventory from "../models/atlas/Inventory.js";
import AtlasQuotation from "../models/atlas/Quotation.js";
import AtlasSettings from "../models/atlas/Settings.js";

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

    try {

      const isOnline =
        await checkInternet();

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

        const LocalClient =
          (
            await import(
              "../models/local/Client.js"
            )
          ).default;

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

        const LocalInventory =
          (
            await import(
              "../models/local/Inventory.js"
            )
          ).default;

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

        const LocalQuotation =
          (
            await import(
              "../models/local/Quotation.js"
            )
          ).default;

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