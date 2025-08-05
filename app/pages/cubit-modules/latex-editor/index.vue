<script setup lang="ts">
import CubitModuleNavigationLayout from "~/components/Cubit/Layout/Module/CubitModuleNavigationLayout.vue";
import CubitModuleNavigationFooter from "~/components/Cubit/Layout/Module/CubitModuleNavigationFooter.vue";

const latexValue = ref('')
const actions = ref([
    {
        id: 'actions',
        items: [
            {
                label: 'Clear Content',
                color: 'error',
                icon: 'i-lucide-trash-2',
                value: 'clear-content',
                onSelect() {
                    latexValue.value = ''
                }
            }
        ]
    }
])
</script>

<template>
    <CubitModuleNavigationLayout
        placeholder="Enter your LaTeX"
        v-model="latexValue"
        :header="true"
        class="w-full h-full"
        footer
    >
        <ClientOnly>
            <CubitUtilityMathjaxEditor v-model="latexValue" class="w-full h-full"/>
        </ClientOnly>
        <template #footer="{actionsOpen, closeActions}">
            <CubitModuleNavigationFooter title="LaTeX Editor" :actions :actionsOpen :closeActions/>
        </template>
    </CubitModuleNavigationLayout>
</template>

<style scoped>

</style>