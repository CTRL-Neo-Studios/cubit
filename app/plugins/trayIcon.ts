import {getCurrentWindow} from "@tauri-apps/api/window";
import {exit} from "@tauri-apps/plugin-process"
import {Menu} from "@tauri-apps/api/menu/menu";
import {TrayIcon} from "@tauri-apps/api/tray";

export default defineNuxtPlugin({
    name: 'tray-icon-register',
    enforce: 'post',
    async setup(nuxtApp) {

        const menu = await Menu.new({
            items: [
                {
                    id: 'quit',
                    text: 'Quit',
                    async action(id) {
                        await getCurrentWindow().close()
                        await exit(0)
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