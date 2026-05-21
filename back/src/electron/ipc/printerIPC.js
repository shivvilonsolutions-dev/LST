const registerPrinterIPC = (ipcMain) => {

    ipcMain.handle("printer:print-pdf", async (_, payload) => {

        // future implementation

        return {
            success: true,
            message: "Print initiated"
        };
    });
};

export default registerPrinterIPC;