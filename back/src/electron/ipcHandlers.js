import registerDialogIPC from "./ipc/dialogIPC.js"
import registerFilesystemIPC from "./ipc/filesystemIPC.js"
import registerNotificationIPC from "./ipc/notificationIPC.js"
import registerPrinterIPC from "./ipc/printerIPC.js"
import registerSystemIPC from "./ipc/systemIPC.js"

const registerIPCHandlers = (ipcMain) => {

    // Native Dialogs
    registerDialogIPC(ipcMain);

    // Filesystem Operations
    registerFilesystemIPC(ipcMain);

    // Desktop Notifications
    registerNotificationIPC(ipcMain);

    // Printing Features
    registerPrinterIPC(ipcMain);

    // System/App Information
    registerSystemIPC(ipcMain);

    console.log("Electron IPC Handlers Registered");
};

export default registerIPCHandlers;