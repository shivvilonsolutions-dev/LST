import os from "os"

const registerSystemIPC = (ipcMain) => {

    ipcMain.handle("system:get-info", async () => {

        return {
            success: true,
            data: {
                platform: os.platform(),
                arch: os.arch(),
                homeDir: os.homedir()
            }
        };
    });
};

export default registerSystemIPC;