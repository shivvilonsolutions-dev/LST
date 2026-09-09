import fs from "fs";
import path from "path";
import os from "os";
import { getCurrentUserId } from "../../config/setDatabase.js";
import getModels from "../../models/getModels.js";

const createStoragePath =
  async (folderName = "") => {

    const {
      LocalSettings,
    } = getModels();

    const userId =
      getCurrentUserId()
      || "ADMIN001";


    // USER ROOT — use Documents folder as safe default (always exists on Windows)
    let rootPath =
      path.join(os.homedir(), "Documents", "LST_Local_Files");

    const settings = await LocalSettings.findOne();

    if (
      settings?.offlinePdfPath
    ) {

      rootPath =
        settings.offlinePdfPath;
    }

    const basePath =
      path.join(

        rootPath,

        userId
      );


    const now =
      new Date();


    const month =
      now.toLocaleString(
        "default",
        {
          month: "long",
        }
      );


    const dayFolder =
      `${now.getDate()}-${month}`;


    const finalPath =
      path.join(
        basePath,
        month,
        dayFolder,
        folderName
      );


    if (
      !fs.existsSync(
        finalPath
      )
    ) {

      fs.mkdirSync(
        finalPath,
        {
          recursive: true,
        }
      );
    }


    return finalPath;
  };


export default
  createStoragePath;