import os from "os"
import fs from "fs"
import path from "path"
import { clipboard, nativeImage, shell } from "electron"
import { exec } from "child_process"

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

    ipcMain.handle("system:copy-image", async (_, dataUrl) => {
        try {
            const image = nativeImage.createFromDataURL(dataUrl);
            clipboard.writeImage(image);
            return { success: true };
        } catch (error) {
            console.error("Clipboard write error:", error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle("system:send-whatsapp-image", async (_, { dataUrl, url }) => {
        try {
            // Step 1: Copy image to clipboard natively
            const image = nativeImage.createFromDataURL(dataUrl);
            clipboard.writeImage(image);

            // Step 2: Open WhatsApp Web in browser
            await shell.openExternal(url);

            // Step 3: Write PowerShell script to temp file (avoids escaping issues)
            const tempScript = path.join(os.tmpdir(), `lst_wa_${Date.now()}.ps1`);
            const psContent = [
                '$wshell = New-Object -ComObject wscript.shell',
                'Start-Sleep -Seconds 7',
                'for ($i = 0; $i -lt 15; $i++) {',
                '    if ($wshell.AppActivate("WhatsApp")) {',
                '        Start-Sleep -Milliseconds 1500',
                '        $wshell.SendKeys("^v")',
                '        Start-Sleep -Milliseconds 1500',
                '        $wshell.SendKeys("{ENTER}")',
                '        break',
                '    }',
                '    Start-Sleep -Milliseconds 1000',
                '}',
            ].join('\r\n');

            fs.writeFileSync(tempScript, psContent, 'utf-8');

            exec(
                `powershell -ExecutionPolicy Bypass -File "${tempScript}"`,
                (err) => {
                    if (err) console.error("WhatsApp auto-paste error:", err);
                    // Clean up temp script
                    try { fs.unlinkSync(tempScript); } catch (_) {}
                }
            );

            return { success: true };
        } catch (error) {
            console.error("send-whatsapp-image error:", error);
            return { success: false, error: error.message };
        }
    });
};

export default registerSystemIPC;