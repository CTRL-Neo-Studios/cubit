<script setup lang="ts">
import { register } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';

onMounted(async () => {

    await register('CmdOrControl+Space', async (event) => {
        const win = getCurrentWindow()
        console.log('Shortcut triggered');
        if (event.state === 'Pressed') {
            (await win.isVisible()) ? await win.hide() : (await win.show(), await win.setFocus());
            // await win.onFocusChanged(({payload: focused}) => {
            //     if (!focused) win.hide();
            // });
        }
    });

    // await getCurrentWindow().onFocusChanged(({payload: focused}) => {
    //     if (!focused) getCurrentWindow().hide();
    // });

})
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>