import fs from "fs"
import path from "path"
import { shell } from "electron"

const registerFilesystemIPC = (ipcMain) => {

    ipcMain.handle("filesystem:file-exists", async (_, filePath) => {
        return fs.existsSync(filePath);
    });

    ipcMain.handle("filesystem:open-folder", async (_, folderPath) => {
        await shell.openPath(folderPath);

        return {
            success: true
        };
    });

    ipcMain.handle("filesystem:create-folder", async (_, folderPath) => {

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        return {
            success: true
        };
    });
};

export default registerFilesystemIPC;