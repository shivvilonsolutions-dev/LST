import Settings
from "../models/local/Settings.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";
import fs from "fs";


export const getSettingsService =
  async () => {

    const settings =
      await Settings.findOne();

    return settings;
  };


export const updateSettingsService =
  async (data) => {

    if (
      data.offlinePdfPath &&
      !fs.existsSync(
        data.offlinePdfPath
      )
    ) {

      throw new Error(
        "Directory path does not exist"
      );
    }

    const settings =
      await Settings.findOneAndUpdate(

        {},

        {
          ...data,

          isSynced: false,
        },

        {
          upsert: true,

          new: true,

          returnDocument:
            "after",
        }
      );

    await syncAfterLocalSave(
      settings,
      "settings"
    );

    return settings;
  };