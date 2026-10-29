const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    dialog,
    shell,
    Notification,
    clipboard,
    nativeImage,
    ipcMain,
    globalShortcut
} = require("electron");

const path = require("path");
const fs = require("fs");
const os = require("os");
const { exec } = require("child_process");

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception in Electron Main:", error);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection in Electron Main:", reason);
});

// START BACKEND SERVER IN PRODUCTION
if (process.env.NODE_ENV !== "development") {
    try {
        if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "supersecretjwtkey12345";
        console.log("Starting backend server in production...");
        import("../back/server.js")
            .then(() => {
                console.log("Backend server started successfully.");
            })
            .catch((err) => {
                console.error("Failed to start backend server:", err);
            });
    } catch (error) {
        console.error("Error starting backend server:", error);
    }
}

// MAIN WINDOW REFERENCE
let mainWindow = null;
let appTray = null;
let isQuitting = false;

// CREATE WINDOW
function createMainWindow() {
    const possiblePreloadPaths = [
        path.join(process.resourcesPath, "electron", "preload.cjs"),
        path.join(app.getAppPath(), "electron", "preload.cjs"),
        path.join(__dirname, "preload.cjs"),
        path.join(process.cwd(), "electron", "preload.cjs"),
    ];

    const preloadPath = possiblePreloadPaths.find((p) => fs.existsSync(p)) || possiblePreloadPaths[0];
    console.log("Using Preload Path:", preloadPath);

    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        icon: path.join(__dirname, "../build/lst-logo.ico"),
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
        },
    });

    return win;
}

// APP MENU
function createAppMenu() {
    const template = [
        {
            label: "File",
            submenu: [
                { role: "quit" }
            ]
        },
        {
            label: "View",
            submenu: [
                { role: "reload" },
                { role: "forceReload" },
                { role: "toggleDevTools" },
                { type: "separator" },
                { role: "resetZoom" },
                { role: "zoomIn" },
                { role: "zoomOut" },
                { type: "separator" },
                { role: "togglefullscreen" }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// SYSTEM TRAY
function createTray() {
    try {
        const trayIconPath = path.join(
            app.isPackaged ? process.resourcesPath : process.cwd(),
            "build",
            "lst-logo.ico"
        );

        if (!fs.existsSync(trayIconPath)) return;

        appTray = new Tray(trayIconPath);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "Open App",
                click: () => {
                    if (mainWindow) {
                        mainWindow.show();
                        mainWindow.focus();
                    }
                }
            },
            {
                label: "Quit",
                click: () => {
                    isQuitting = true;
                    app.quit();
                }
            }
        ]);

        appTray.setToolTip("LST Quotation Desktop App");
        appTray.setContextMenu(contextMenu);
    } catch (err) {
        console.error("Tray error:", err);
    }
}

// REGISTER ALL IPC HANDLERS
function registerAllIPC() {
    // Dialogs
    ipcMain.handle("dialog:select-folder", async () => {
        return await dialog.showOpenDialog({
            properties: ["openDirectory"]
        });
    });

    ipcMain.handle("dialog:save-file", async (_, options) => {
        let defaultPath = options?.defaultPath || "";
        const fileType = options?.fileType;

        let systemFilters = [{ name: "All Files (*.*)", extensions: ["*"] }];

        if (fileType === "excel") {
            systemFilters = [
                { name: "Excel Workbooks (*.xlsx)", extensions: ["xlsx"] },
                { name: "All Files (*.*)", extensions: ["*"] }
            ];
            if (!defaultPath.toLowerCase().endsWith(".xlsx")) {
                defaultPath = `${defaultPath}.xlsx`;
            }
        } else if (fileType === "pdf") {
            systemFilters = [
                { name: "PDF Documents (*.pdf)", extensions: ["pdf"] },
                { name: "All Files (*.*)", extensions: ["*"] }
            ];
            if (!defaultPath.toLowerCase().endsWith(".pdf")) {
                defaultPath = `${defaultPath}.pdf`;
            }
        }

        const result = await dialog.showSaveDialog({
            title: "Save Quotation Document",
            defaultPath: path.normalize(defaultPath),
            filters: systemFilters,
            properties: ["showOverwriteConfirmation"]
        });

        if (result.canceled) return { canceled: true, filePath: null };
        return { canceled: false, filePath: result.filePath };
    });

    // Filesystem
    ipcMain.handle("filesystem:file-exists", async (_, filePath) => {
        return fs.existsSync(filePath);
    });

    ipcMain.handle("filesystem:save-file-to-destination", async (_, { sourcePath, destinationPath }) => {
        try {
            if (!fs.existsSync(sourcePath)) {
                return { success: false, error: "Source file does not exist." };
            }
            fs.copyFileSync(sourcePath, destinationPath);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle("filesystem:open-folder", async (_, folderPath) => {
        try {
            await shell.openPath(path.normalize(folderPath));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle("filesystem:open-explorer", async (_, filePath) => {
        try {
            if (filePath) {
                shell.showItemInFolder(path.normalize(filePath));
                return { success: true };
            }
            return { success: false, error: "No file path provided" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    // Notification
    ipcMain.handle("notification:show", async (_, payload) => {
        try {
            const { title, body } = payload || {};
            new Notification({ title, body }).show();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    // Clipboard & WhatsApp Auto-Send
    ipcMain.handle("system:copy-image", async (_, dataUrl) => {
        try {
            const image = nativeImage.createFromDataURL(dataUrl);
            clipboard.writeImage(image);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle("system:send-whatsapp-image", async (_, { dataUrl, url }) => {
        try {
            const image = nativeImage.createFromDataURL(dataUrl);
            clipboard.writeImage(image);

            await shell.openExternal(url);

            const tempScript = path.join(os.tmpdir(), `lst_wa_${Date.now()}.ps1`);
            const psContent = [
                '$wshell = New-Object -ComObject wscript.shell',
                'Start-Sleep -Seconds 7',
                'for ($i = 0; $i -lt 15; $i++) {',
                '    if ($wshell.AppActivate("WhatsApp")) {',
                '        Start-Sleep -Milliseconds 1500',
                '        $wshell.SendKeys("^v")',
                '        Start-Sleep -Milliseconds 1500',
                '        $wshell.SendKeys("{ENTER}")',
                '        break',
                '    }',
                '    Start-Sleep -Milliseconds 1000',
                '}',
            ].join('\r\n');

            fs.writeFileSync(tempScript, psContent, 'utf-8');

            exec(`powershell -ExecutionPolicy Bypass -File "${tempScript}"`, () => {
                try { fs.unlinkSync(tempScript); } catch (_) {}
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    console.log("All Electron IPC handlers registered.");
}

// INITIALIZE APPLICATION
const initializeApplication = async () => {
    try {
        mainWindow = createMainWindow();

        // Shortcuts
        globalShortcut.register("CommandOrControl+Shift+I", () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
        });
        globalShortcut.register("F12", () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
        });

        // Error logging
        mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
            console.error(`Failed to load URL: ${validatedURL}, Error: ${errorDescription} (${errorCode})`);
        });

        // Load Frontend
        if (process.env.NODE_ENV === "development") {
            console.log("Loading development frontend from localhost:5173");
            await mainWindow.loadURL("http://localhost:5173");
        } else {
            const possibleHtmlPaths = [
                path.join(__dirname, "../front/dist/index.html"),
                path.join(app.getAppPath(), "front/dist/index.html"),
                path.join(process.resourcesPath, "front/dist/index.html"),
            ];

            const htmlPath = possibleHtmlPaths.find((p) => fs.existsSync(p)) || possibleHtmlPaths[0];
            console.log("Loading frontend from:", htmlPath);
            await mainWindow.loadFile(htmlPath);
        }

        registerAllIPC();
        createAppMenu();
        createTray();

        // Prevent window close from quitting app
        mainWindow.on("close", (event) => {
            if (!isQuitting) {
                event.preventDefault();
                mainWindow.hide();
            }
        });

        mainWindow.on("closed", () => {
            mainWindow = null;
        });

        // Handle quit requests
        app.on("before-quit", () => {
            isQuitting = true;
        });
    } catch (error) {
        console.error("Initialization error:", error);
    }
};

app.whenReady().then(initializeApplication);

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        initializeApplication();
    }
});

app.on("window-all-closed", () => {
    // Don't quit automatically - let tray handle it
    // Only quit if explicitly requested
});