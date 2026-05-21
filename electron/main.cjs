const { app } = require("electron");
const path = require("path");


// WINDOW
const createMainWindow =
    require(
        "../back/src/electron/native/windowManager.js"
    ).default;


// IPC

const registerIPCHandlers =
    require("../back/src/electron/ipcHandlers.js").default;


// NATIVE FEATURES

const createAppMenu =
    require("../back/src/electron/native/appMenu.js").default;

const createTray =
    require("../back/src/electron/native/tray.js").default;



if (
    process.env.NODE_ENV !==
    "development"
) {

    require("../back/server");
}

// MAIN WINDOW REFERENCE

let mainWindow = null;


// CREATE APPLICATION

const initializeApplication = async () => {

    if (
        process.env.NODE_ENV !==
        "development"
    ) {

        await new Promise(
            (resolve) => {

                setTimeout(
                    resolve,
                    7000
                );
            }
        );
    }

    // CREATE WINDOW

    mainWindow = createMainWindow();

    const {
        globalShortcut
    } = require("electron");

    globalShortcut.register(

        "CommandOrControl+Shift+I",

        () => {

            mainWindow.webContents
                .toggleDevTools();
        }
    );

    // LOAD FRONTEND

    if (process.env.NODE_ENV === "development") {

        await mainWindow.loadURL(
            "http://localhost:5173"
        );

    } else {

        await mainWindow.loadFile(
            path.join(
                __dirname,
                "../front/dist/index.html"
            )
        );
    }


    // REGISTER IPC

    registerIPCHandlers(
        require("electron").ipcMain
    );


    // CREATE MENU

    createAppMenu();


    // CREATE TRAY

    createTray();


    // WINDOW EVENTS

    mainWindow.on(
        "closed",
        () => {

            mainWindow = null;
        }
    );
};


// ELECTRON READY

app.whenReady().then(
    initializeApplication
);


// MACOS SUPPORT

app.on(
    "activate",
    () => {

        if (
            require("electron")
                .BrowserWindow
                .getAllWindows()
                .length === 0
        ) {

            initializeApplication();
        }
    }
);


// CLOSE APPLICATION

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {

            app.quit();
        }
    }
);