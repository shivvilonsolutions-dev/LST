import getModels from "../models/getModels.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";
import fs from "fs";


export const getSettingsService =
  async () => {

    const {
      LocalSettings
    } = getModels();

    const settings =
      await LocalSettings.findOne();

    return settings;
  };


export const updateSettingsService =
  async (data) => {

    const {
      LocalSettings
    } = getModels();

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
      await LocalSettings.findOneAndUpdate(

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

    console.log("New Path: ", data.offlinePdfPath)

    await syncAfterLocalSave(
      settings,
      "settings"
    );

    return settings;
  };