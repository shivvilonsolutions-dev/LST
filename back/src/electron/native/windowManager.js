import {
    app,
    BrowserWindow
} from "electron";

import path from "path";

const createMainWindow = () => {

    const preloadPath = app.isPackaged

        ? path.join(
            process.resourcesPath,
            "electron",
            "preload.cjs"
          )

        : path.join(
            process.cwd(),
            "electron",
            "preload.cjs"
          );

    const mainWindow =
        new BrowserWindow({

            width: 1400,
            height: 900,

            webPreferences: {

                preload: preloadPath,

                contextIsolation: true,

                nodeIntegration: false
            }
        });

    return mainWindow;
};

export default createMainWindow;