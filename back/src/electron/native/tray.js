import { Tray, Menu, app } from "electron";
import path from "path";
import fs from "fs";

let tray = null;

const createTray = () => {
    try {
        const trayIconPath = path.join(
            app.isPackaged ? process.resourcesPath : process.cwd(),
            "build",
            "lst-logo.ico"
        );

        if (!fs.existsSync(trayIconPath)) {
            console.log("Tray icon not found at:", trayIconPath);
            return;
        }

        tray = new Tray(trayIconPath);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: "Open App",
                click: () => {
                    const allWindows = require("electron").BrowserWindow.getAllWindows();
                    if (allWindows.length > 0) {
                        allWindows[0].show();
                        allWindows[0].focus();
                    }
                }
            },
            {
                label: "Quit",
                role: "quit"
            }
        ]);

        tray.setToolTip("LST Quotation Desktop App");
        tray.setContextMenu(contextMenu);
    } catch (error) {
        console.error("Failed to create tray:", error);
    }
};

export default createTray;