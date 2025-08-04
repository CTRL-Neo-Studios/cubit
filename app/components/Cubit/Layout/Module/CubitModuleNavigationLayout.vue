<script setup lang="ts">
import useCubitRoutes from "~/composables/general/useCubitRoutes";
import type {AcceptableValue, CommandPaletteGroup, CommandPaletteItem} from "@nuxt/ui";

const model = defineModel<string>('modelValue', {default: ''})
const selectedEntry = defineModel<AcceptableValue | AcceptableValue[] | undefined>('selectedEntry')
const actionsOpen = ref(false)

const $cr = useCubitRoutes()

const props = defineProps<{placeholder?: string, loading?: boolean, header?: boolean, footer?: boolean, groups?: CommandPaletteGroup<CommandPaletteItem>[], permeatedSlots?: string[], escapeHandler?: () => void | Promise<void>, icon?: string}>()
const emits = defineEmits<{
    (e: 'selected', args: CustomEvent<any>, entry: AcceptableValue | AcceptableValue[] | undefined): void
}>()



defineShortcuts({
    'escape': {
        async handler() {
            if (unref(actionsOpen))
                actionsOpen.value = false
            else {
                if (props.escapeHandler) {
                    await props.escapeHandler()
                } else {
                    await $cr.toMainMenu(true, true)
                }
            }
        },
        usingInput: true
    },
    'meta_k': {
        async handler() {
            if (props?.footer)
                actionsOpen.value = !unref(actionsOpen)
            else
                actionsOpen.value = false
        },
        usingInput: true
    }
})

const placeholderGroups = ref<CommandPaletteGroup<CommandPaletteItem>[]>([
    {
        id: 'module',
        items: []
    }
])

watch(actionsOpen, async (open) => {
    if (!open) {
        // wait one tick so the popover is fully gone
        await nextTick()
        // focus the first input inside the main palette
        const input = document.querySelector('.u-command-palette input') as HTMLInputElement
        input?.focus()
    }
})

const forwardedSlots = computed(() =>
    Object.keys(useSlots()).filter(n => !['empty', 'footer'].includes(n))
)
</script>

<template>
    <div class="w-full h-full">
        <UCommandPalette
            :loading="props.loading"
            :ui="{
                root: 'h-screen! u-command-palette',
                content: 'h-full',
                empty: 'p-0 h-full'
            }"
            :icon="props?.icon || 'i-lucide-arrow-left'"
            :groups="props.groups != null ? props.groups : placeholderGroups"
            :disabled="!props?.header"
            v-model:searchTerm="model"
            v-model="selectedEntry"
            :placeholder="props?.placeholder !== undefined ? props.placeholder : 'Back'"
            autofocus
            @entryFocus="args => {
                emits('selected', args, selectedEntry)
            }"
        >
            <!-- keep these explicit -->
            <template #empty><slot name="default" /><slot name="empty" /></template>
            <template #footer v-if="props.footer"><slot name="footer" :actionsOpen="actionsOpen" /></template>

            <!-- forward everything else -->
            <template
                v-for="name in permeatedSlots"
                :key="name"
                #[name]="slotData"
            >
                <slot :name="name" v-bind="slotData" :actionsOpen="actionsOpen" />
            </template>
        </UCommandPalette>
    </div>
</template>

<style>
.u-command-palette {

}
</style>