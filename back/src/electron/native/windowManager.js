import {
    app,
    BrowserWindow
} from "electron";

import path from "path";
import fs from "fs";

const createMainWindow = () => {
    // Find preload.cjs reliably across development and packaged builds
    const possiblePreloadPaths = [
        path.join(process.resourcesPath, "electron", "preload.cjs"),
        path.join(app.getAppPath(), "electron", "preload.cjs"),
        path.join(process.cwd(), "electron", "preload.cjs"),
        path.join(__dirname, "../../../../electron/preload.cjs"),
    ];

    const preloadPath = possiblePreloadPaths.find(p => fs.existsSync(p)) || possiblePreloadPaths[0];
    console.log("Using Preload Path:", preloadPath);

    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false // Enables loading local files without CORS issues
        }
    });

    return mainWindow;
};

export default createMainWindow;