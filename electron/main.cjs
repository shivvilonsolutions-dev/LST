const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception in Electron Main:", error);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection in Electron Main:", reason);
});

// START BACKEND SERVER IN PRODUCTION
if (process.env.NODE_ENV !== "development") {
    try {
        console.log("Starting backend server in production...");
        // Use dynamic import for ES module server.js
        import("../back/server.js").then(() => {
            console.log("Backend server imported successfully.");
        }).catch((err) => {
            console.error("Failed to start backend server:", err);
        });
    } catch (error) {
        console.error("Error starting backend:", error);
    }
}

// WINDOW
const createMainWindow = require("../back/src/electron/native/windowManager.js").default;

// IPC
const registerIPCHandlers = require("../back/src/electron/ipcHandlers.js").default;

// NATIVE FEATURES
const createAppMenu = require("../back/src/electron/native/appMenu.js").default;
const createTray = require("../back/src/electron/native/tray.js").default;

// MAIN WINDOW REFERENCE
let mainWindow = null;

// CREATE APPLICATION
const initializeApplication = async () => {
    try {
        // CREATE WINDOW
        mainWindow = createMainWindow();

        // DEV TOOLS SHORTCUT (Ctrl+Shift+I or F12)
        globalShortcut.register("CommandOrControl+Shift+I", () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
        });
        globalShortcut.register("F12", () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
        });

        // HANDLE LOAD ERRORS
        mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
            console.error(`Failed to load URL: ${validatedURL}, Error: ${errorDescription} (${errorCode})`);
        });

        // LOAD FRONTEND
        if (process.env.NODE_ENV === "development") {
            console.log("Loading development frontend from localhost:5173");
            await mainWindow.loadURL("http://localhost:5173");
        } else {
            // Find index.html reliably
            const possibleHtmlPaths = [
                path.join(__dirname, "../front/dist/index.html"),
                path.join(app.getAppPath(), "front/dist/index.html"),
                path.join(process.resourcesPath, "front/dist/index.html"),
            ];

            const htmlPath = possibleHtmlPaths.find(p => fs.existsSync(p)) || possibleHtmlPaths[0];
            console.log("Loading frontend from:", htmlPath);
            await mainWindow.loadFile(htmlPath);
        }

        // REGISTER IPC
        try {
            registerIPCHandlers(ipcMain);
        } catch (err) {
            console.error("Failed to register IPC handlers:", err);
        }

        // CREATE MENU
        try {
            createAppMenu();
        } catch (err) {
            console.error("Failed to create app menu:", err);
        }

        // CREATE TRAY
        try {
            createTray();
        } catch (err) {
            console.error("Failed to create tray:", err);
        }

        // WINDOW EVENTS
        mainWindow.on("closed", () => {
            mainWindow = null;
        });

    } catch (error) {
        console.error("Error during application initialization:", error);
    }
};

// ELECTRON READY
app.whenReady().then(initializeApplication);

// MACOS SUPPORT
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        initializeApplication();
    }
});

// CLOSE APPLICATION
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});