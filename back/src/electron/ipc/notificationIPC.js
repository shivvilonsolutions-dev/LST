import { Notification } from "electron"

const registerNotificationIPC = (ipcMain) => {

    ipcMain.handle("notification:show", async (_, payload) => {

        const { title, body } = payload;

        new Notification({
            title,
            body
        }).show();

        return {
            success: true
        };
    });
};

export default registerNotificationIPC;