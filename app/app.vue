<script setup lang="ts">
import { register } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';
import useAppNotification from "~/composables/utility/useAppNotification";

onMounted(async () => {

    await register('CmdOrControl+Space', async (event) => {
        const win = getCurrentWindow()
        console.log('Shortcut triggered');
        if (event.state === 'Pressed') {
            (await win.isVisible()) ? await win.hide() : (await win.show(), await win.setFocus());

            //! Disable these for debug purposes if you want to inspect HTML elements
            await win.onFocusChanged(({payload: focused}) => {
                if (!focused) win.hide();
            });
        }
    });

    //! Disable these for debug purposes if you want to inspect HTML elements
    await getCurrentWindow().onFocusChanged(({payload: focused}) => {
        if (!focused) getCurrentWindow().hide();
    });

    await useAppNotification().initialize()

    await useAppNotification().notify("Cubit", "Cubit is opened and running in the background.")
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