<script setup lang="ts">
import useCubitRoutes from "~/composables/general/useCubitRoutes";
import type {AcceptableValue, CommandPaletteGroup, CommandPaletteItem} from "@nuxt/ui";

const searchTerm = defineModel<string>('searchTerm', {default: ''})
const selectedEntry = defineModel<AcceptableValue | AcceptableValue[] | undefined>()
const actionsOpen = ref(false)

const $cr = useCubitRoutes()

const props = withDefaults(defineProps<{
    placeholder?: string, // Input field placeholder
    loading?: boolean, // `true` disables the palette for loading
    header?: boolean, // `true` Enables the input field
    footer?: boolean, // `false` disables the footer slot
    disableFooterActionsFirst?: boolean, // if `true`, when handling the escape key shortcut it'll set the actionsOpen value to false first
    groups?: CommandPaletteGroup<CommandPaletteItem>[],
    permeatedSlots?: string[],
    escapeHandler?: () => void | Promise<void>,
    icon?: string
}>(), {
    disableFooterActionsFirst: true,
    loading: false,
    header: true,
    footer: false,
    icon: 'i-lucide-arrow-left',
    placeholder: 'Back',
    groups: () => [
        {
            id: 'module',
            items: []
        }
    ]
})
const emits = defineEmits<{
    (e: 'selected', args: CustomEvent<any>, entry: AcceptableValue | AcceptableValue[] | undefined): void
}>()

defineShortcuts({
    'escape': {
        async handler() {
            if (unref(actionsOpen) && props?.disableFooterActionsFirst)
                actionsOpen.value = false
            else {
                if (props.escapeHandler) {
                    await props.escapeHandler()
                } else {
                    await $cr.toMainMenu(true, true)
                }
                actionsOpen.value = false
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

function closeActions() {
    actionsOpen.value = false
}
</script>

<template>
    <div class="w-full h-full">
        <UCommandPalette
            :loading="props.loading"
            :ui="{
                root: 'h-screen! u-command-palette',
                content: 'h-full',
                empty: 'p-0 h-full',
                footer: 'bg-gradient-to-r from-primary-100 dark:from-primary-950 via-default to-default rounded-b-lg',
                // item: 'data-highlighted:not-data-disabled:before:bg-primary',
                // itemLabelBase: 'group-data-highlighted:text-inverted',
                // itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-inverted'
            }"
            :icon="props?.icon"
            :groups="props?.groups"
            :disabled="!props?.header"
            v-model:search-term="searchTerm"
            v-model="selectedEntry"
            :placeholder="props?.placeholder"
            autofocus
            @entryFocus="args => {
                emits('selected', args, selectedEntry)
            }"
        >
            <!-- keep these explicit -->
            <template #empty><slot name="default" /><slot name="empty" /></template>
            <template #footer v-if="props.footer"><slot name="footer" :actionsOpen :closeActions /></template>

            <!-- forward everything else -->
            <template
                v-for="name in permeatedSlots"
                :key="name"
                #[name]="slotData"
            >
                <slot :name="name" v-bind="slotData" :actionsOpen="actionsOpen" :closeActions="closeActions" />
            </template>
        </UCommandPalette>
    </div>
</template>

<style>
.u-command-palette {

}
</style>