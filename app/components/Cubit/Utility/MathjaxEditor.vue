<!-- CubitUtilityMathjaxEditor.client.vue -->
<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import useAppWindow from '~/composables/app/useAppWindow'

const model = defineModel<string>({ default: '' })

const $win = useAppWindow()

const rendered = ref<HTMLDivElement>()

function typeset() {
    if (window.MathJax && rendered.value) {
        window.MathJax.typesetClear([rendered.value])
        window.MathJax.typesetPromise([rendered.value])
    }
}

watch(model, () => {
    nextTick(typeset)
    resize()
}, { immediate: true })

async function resize() {
    await nextTick()
    const h = Math.min(
        document.documentElement.scrollHeight,
        600   // your own upper cap
    )
    await $win.setWindowLogicalHeight(h, true)
    console.log('sadas')
}

onMounted(resize)
</script>

<template>
    <div class="flex flex-col gap-3 p-4">
        <!-- live preview -->
        <div
            ref="rendered"
            class="prose prose-sm dark:prose-invert max-w-none"
            v-text="`$$${model}$$`"
        />
    </div>
</template>