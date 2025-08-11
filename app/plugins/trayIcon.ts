import {getCurrentWindow} from "@tauri-apps/api/window";
import {defaultWindowIcon} from "@tauri-apps/api/app";
import {Menu} from "@tauri-apps/api/menu/menu";
import {TrayIcon} from "@tauri-apps/api/tray";

export default defineNuxtPlugin({
    name: 'tray-icon-register',
    enforce: 'post',
    async setup(nuxtApp) {
        const win = getCurrentWindow()

        const menu = await Menu.new({
            items: [
                {
                    id: 'quit',
                    text: 'Quit',
                    action(id) {
                        win.close()
                    }
                },
            ],
        });

        const tray = await TrayIcon.new({
            menu,
            icon: 'icons/32x32.png',
            showMenuOnLeftClick: true,
            id: 'cubit-tray-icon',
            title: 'Cubit'
        });
        await tray.setMenu(menu)
    }
})