import { dialog } from "electron"

const registerDialogIPC = (ipcMain) => {

    ipcMain.handle("dialog:select-folder", async () => {

        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"]
        });

        return result;
    });

    ipcMain.handle("dialog:select-file", async () => {

        const result = await dialog.showOpenDialog({
            properties: ["openFile"]
        });

        return result;
    });
};

export default registerDialogIPC;