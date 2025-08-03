<script setup lang="ts">
import CubitModuleNavigationLayout from "~/components/Cubit/Layout/Module/CubitModuleNavigationLayout.vue";
import CubitModuleNavigationFooter from "~/components/Cubit/Layout/Module/CubitModuleNavigationFooter.vue";
</script>

<template>
    <CubitModuleNavigationLayout :header="false" footer class="w-full h-full">
        <ClientOnly>
            <CubitUtilityDesmosGraph class="w-full h-full"/>
        </ClientOnly>
        <template #footer="{actionsOpen}">
            <CubitModuleNavigationFooter title="Calculator" :actions-open="actionsOpen"/>
        </template>
    </CubitModuleNavigationLayout>
</template>

<style scoped>

</style>