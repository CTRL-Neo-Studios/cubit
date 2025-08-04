<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import useAppWindow from "~/composables/app/useAppWindow";

const $win = useAppWindow()

const el = ref<HTMLDivElement>();
let calc: Desmos.Calculator;

onMounted(async () => {
    // @ts-ignore
    calc = Desmos.GraphingCalculator(el.value!, {
        fontSize: 12,
        expressions: true,
        settingsMenu: false,
    });

    // wait for Desmos to finish its first paint
    await nextTick();
    await resizeToContent();   // shrink to fit once mounted
});

await resizeToContent();   // shrink to fit once mounted

async function resizeToContent() {
    const doc = document.documentElement;

    // measure the *real* height of the rendered page
    const contentHeight = Math.min(
        doc.scrollHeight,
        600   // optional upper cap (px) – change or delete as you like
    );

    await $win.setWindowLogicalHeight(contentHeight + 93, true)
}
</script>

<template>
    <!-- flex-1 lets it take whatever space is left, no overflow -->
    <div :style="{ height: `400px` }" class="w-full">
        <div ref="el" class="w-full h-full" />
    </div>
</template>