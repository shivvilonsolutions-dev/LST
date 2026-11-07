const {
  contextBridge,
  ipcRenderer,
  shell,
} = require("electron");


contextBridge.exposeInMainWorld(

  "electronAPI",

  {

    openFolder:
      (folderPath) =>
        ipcRenderer.invoke(
          "filesystem:open-folder",
          folderPath
        ),

    saveFileToDestination: (data) =>
      ipcRenderer.invoke(
        "filesystem:save-file-to-destination",
        data
      ),

    saveFileDialog: (options) =>
      ipcRenderer.invoke(
        'dialog:save-file',
        options
      ),

    openExplorer: (filePath) =>
      ipcRenderer.invoke(
        'filesystem:open-explorer',
        filePath
      ),

    selectFolder: () =>
      ipcRenderer.invoke(
        "dialog:select-folder"
      ),

    openExternal: (url) =>
      ipcRenderer.invoke(
        "system:open-external-url",
        url
      ),

    showItemInFolder:
      (filePath) =>
        shell.showItemInFolder(
          filePath
        ),

    copyImageToClipboard: (dataUrl) =>
      ipcRenderer.invoke("system:copy-image", dataUrl),

    sendWhatsAppImage: (dataUrl, url) =>
      ipcRenderer.invoke("system:send-whatsapp-image", { dataUrl, url }),
  }
);