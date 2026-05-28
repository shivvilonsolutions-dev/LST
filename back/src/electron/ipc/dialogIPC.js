import { dialog } from "electron"

const registerDialogIPC = (ipcMain) => {

    ipcMain.handle("dialog:select-folder", async () => {

        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"]
        });
 
        return result;
    });

    ipcMain.handle("dialog:save-file", async (event, options) => {
        const result = await dialog.showSaveDialog({
            title: "Save Quotation",
            defaultPath: options.defaultPath, // Suggests a filename or directory
            filters: [
                { name: 'PDF Files', extensions: ['pdf'] },
                { name: 'Excel Files', extensions: ['xlsx'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['showOverwriteConfirmation']
        });

        if (result.canceled) {
            return { canceled: true, filePath: null };
        }

        // Returns the actual path the user chose (e.g. "C:/Users/Name/Desktop/Quotation.xlsx")
        return { canceled: false, filePath: result.filePath };
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