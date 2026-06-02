import { dialog } from "electron"

const registerDialogIPC = (ipcMain) => {

    ipcMain.handle("dialog:select-folder", async () => {

        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"]
        });
 
        return result;
    });

    ipcMain.handle("dialog:save-file", async (_, options) => {

        return await dialog
            .showSaveDialog({
                title: "Save File",
                defaultPath: options.defaultPath,
            });
    }
    );
};

export default registerDialogIPC;