<script setup lang="ts">
import {getCurrentWindow, LogicalSize} from '@tauri-apps/api/window';
import {defaultModules} from "~/logic/defaultModules";
import useWindowControl from "~/composables/utility/useWindowControl";

const $win = useWindowControl()

defineShortcuts({
    'escape': {
        async handler() {
            await $win.hideWindow()
        },
        usingInput: true
    }
})


await getCurrentWindow().setSize(new LogicalSize(600, 300));

const commandPalette = ref([
    {
        id: 'default-modules',
        items: defaultModules().map(i => ({id: i.moduleId, label: i.moduleName, icon: i.moduleIcon, to: `/cubit-modules/${i.moduleId}`}))
    }
])
const value = ref({})
</script>

<template>
    <UCommandPalette autofocus v-model="value" :groups="commandPalette"/>
</template>
