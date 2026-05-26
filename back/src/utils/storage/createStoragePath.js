import fs
from "fs";

import path
from "path";

import {
  getCurrentUserId,
} from "../../config/setDatabase.js";


const createStoragePath =
  () => {

    const userId =
      getCurrentUserId()
      || "ADMIN001";


    // USER ROOT

    const basePath =
      path.join(

        "D:\\LST_Local_Files",

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
        dayFolder
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