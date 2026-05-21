import {
    Tray,
    Menu
} from "electron";

import path from "path";

import {
    fileURLToPath
} from "url";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

let tray = null;

const createTray = () => {

    tray = new Tray(

        path.join(
            __dirname,
            "../../../assets/icon.png"
        )
    );

    const contextMenu =
        Menu.buildFromTemplate([

            {
                label: "Open App",

                click: () => {

                    console.log(
                        "Open App"
                    );
                }
            },

            {
                label: "Quit",
                role: "quit"
            }
        ]);

    tray.setToolTip(
        "YourApp"
    );

    tray.setContextMenu(
        contextMenu
    );
};

export default createTray;