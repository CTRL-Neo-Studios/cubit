<script setup lang="ts">
const latexValue = ref('')
</script>

<template>
    <CubitLayoutModuleNavigation title="LaTeX Editor" placeholder="Enter your LaTeX" v-model="latexValue" :header="true" class="w-full h-full">
        <ClientOnly>
            <CubitUtilityMathjaxEditor v-model="latexValue" class="w-full h-full"/>
        </ClientOnly>
    </CubitLayoutModuleNavigation>
</template>

<style scoped>

</style>