import { app } from "electron"
import path from "path"

const getAppPaths = () => {

    const documentsPath =
        app.getPath("documents");

    const downloadsPath =
        app.getPath("downloads");

    const baseAppPath = path.join(
        documentsPath,
        "YourApp"
    );

    return {
        documentsPath,
        downloadsPath,

        baseAppPath,

        quotationsPath: path.join(
            baseAppPath,
            "Quotations"
        ),

        excelPath: path.join(
            baseAppPath,
            "Excel"
        ),

        backupsPath: path.join(
            baseAppPath,
            "Backups"
        )
    };
};

export default getAppPaths;