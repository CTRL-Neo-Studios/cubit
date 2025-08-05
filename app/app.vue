<script setup lang="ts">
import { register } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';
import useAppNotification from "~/composables/app/useAppNotification";
import useAppWindow from "~/composables/app/useAppWindow";

const $win = useAppWindow()

onMounted(async () => {

    await register('CmdOrControl+Space', async (event) => {
        const win = getCurrentWindow()
        console.log('Shortcut triggered');
        if (event.state === 'Pressed') {
            if(await win.isVisible()) {
                await win.hide()
            } else {
                await win.show()
                await win.setFocus()

                //! Disable this for debug purposes
                // await win.onFocusChanged(({payload: focused}) => {
                //     if (!focused && unref($win.shouldHideOnBlur())) win.hide();
                // });
            }
        }
    });

    await useAppNotification().initialize()

    await useAppNotification().notifyMessage("Cubit", "Cubit is opened and running in the background.")
})
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<style>
@reference "~/assets/css/main.css";

body {
    @apply bg-default/90;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.15s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
    transition: all 0.15s;
}
.layout-enter-from,
.layout-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>