import {register} from "@tauri-apps/plugin-global-shortcut";
import {getCurrentWindow} from "@tauri-apps/api/window";
import useAppNotification from "~/composables/app/useAppNotification";
import useAppWindow from "~/composables/app/useAppWindow";

export default defineNuxtPlugin({
    name: 'shortcuts-register',
    enforce: 'post',
    async setup(nuxtApp) {
        await register('CmdOrControl+Period', async (event) => {
            const $win = useAppWindow()
            const win = getCurrentWindow()
            console.log('Shortcut triggered');
            if (event.state === 'Pressed') {
                if(await win.isVisible()) {
                    await win.hide()
                } else {
                    await win.show()
                    await win.setFocus()

                    //! Disable this for debug purposes
                    await win.onFocusChanged(({payload: focused}) => {
                        if (!focused && unref($win.shouldHideOnBlur())) win.hide();
                    });
                }
            }
        });

        await useAppNotification().initialize()

        await useAppNotification().notifyMessage("Cubit", "Cubit is opened and running in the background.")
    }
})