<script setup lang="ts">
import {defaultModules} from "~/logic/defaultModules";
import useAppWindow from "~/composables/app/useAppWindow";
import CubitModuleNavigationLayout from "~/components/Cubit/Layout/Module/CubitModuleNavigationLayout.vue";
import CubitModuleNavigationFooter from "~/components/Cubit/Layout/Module/CubitModuleNavigationFooter.vue";
import useCubitRoutes from "~/composables/general/useCubitRoutes";

const $win = useAppWindow()
const $cr = useCubitRoutes()


await $win.resetWindowSizeToDefault();
await $win.centerWindow();

const commandPalette = ref([
    ...defaultModules().map(i => ({
        id: i.groupId,
        label: i.groupName,
        icon: i.groupIcon,
        items: i.modules.map(m => ({
            id: m.moduleId,
            label: m.moduleName,
            icon: m.moduleIcon || 'i-lucide-codesandbox',
            async onSelect() {
                await $cr.toModules(m.moduleId)
            }
        }))
    }))
])
const selectedEntry = ref()
</script>

<template>
    <CubitModuleNavigationLayout
        icon="i-lucide-search"
        footer
        header
        autofocus
        placeholder="Search for action..."
        :groups="commandPalette"
        :escape-handler="async () => {
            await $win.hideWindow()
        }"
        v-model="selectedEntry"
        horizontal-layout
    >
        <template #footer="{actionsOpen}">
            <CubitModuleNavigationFooter :actionsOpen/>
        </template>
    </CubitModuleNavigationLayout>
</template>
