import fs
from "fs";

import path
from "path";


const createStoragePath =
  (basePath) => {

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