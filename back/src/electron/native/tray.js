const createTray = () => {

    const trayIconPath =

        path.join(

            process.cwd(),

            "build",

            "logo.png"
        );


    console.log(
        "Tray Icon:",
        trayIconPath
    );


    tray = new Tray(
        trayIconPath
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