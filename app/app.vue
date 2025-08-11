<script setup lang="ts">
import { register } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';
import useAppNotification from "~/composables/app/useAppNotification";
import useAppWindow from "~/composables/app/useAppWindow";

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
    @apply bg-transparent;
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