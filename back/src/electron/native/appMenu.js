import {
    Menu
} from "electron"

const createAppMenu = () => {

    const template = [

        {
            label: "File",

            submenu: [
                {
                    role: "quit"
                }
            ]
        },

        {
            label: "View",

            submenu: [
                {
                    role: "reload"
                },
                {
                    role: "toggledevtools"
                }
            ]
        }
    ];

    const menu =
        Menu.buildFromTemplate(
            template
        );

    Menu.setApplicationMenu(menu);
};

export default
    createAppMenu;