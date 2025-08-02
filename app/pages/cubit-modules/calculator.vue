<script setup lang="ts">
</script>

<template>
    <CubitLayoutModuleNavigation title="Calculator" :header="false" class="w-full h-full">
        <ClientOnly>
            <CubitUtilityDesmosGraph class="w-full h-full"/>
        </ClientOnly>
    </CubitLayoutModuleNavigation>
</template>

<style scoped>

</style>