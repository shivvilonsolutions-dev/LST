import {
    autoUpdater
}from "electron-updater"

const initializeUpdater = () => {

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on(
        "update-downloaded",
        () => {

            console.log(
                "Update Downloaded"
            );
        }
    );
};

export default
    initializeUpdater;