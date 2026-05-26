const {
    contextBridge,
    ipcRenderer,
    shell,

} = require("electron");

contextBridge.exposeInMainWorld(

    "electronAPI",

    {

        selectFolder: () =>

            ipcRenderer.invoke(
                "dialog:select-folder"
            ),

        openExternal: (url) =>

            shell.openExternal(
                url
            ),
    }
);