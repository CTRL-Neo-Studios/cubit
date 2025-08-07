<script setup lang="ts">
import type {CommandPaletteGroup, CommandPaletteItem} from "@nuxt/ui";

const actionsValue = defineModel<string>({default: ''})
const actionsOpen = defineModel<boolean>('actionsOpen', {default: false})
const actionsSearchTerm = defineModel<string>('actionsSearchTerm', {default: ''})
const actionsSearchPlaceholder = defineModel<string>('actionsSearchPlaceholder', {default: 'Search Action...'})

const props = defineProps<{title?: string, actions?: CommandPaletteGroup<CommandPaletteItem>[], closeActions?: () => void}>()
</script>

<template>
    <div class="flex items-center justify-start gap-2">
        <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-primary ml-1" />
        <div class="text-left text-xs text-muted" v-if="props?.title">{{props.title}}</div>
        <div class="flex-grow"/>
        <div class="flex items-center gap-1">
            <template v-if="props?.actions">
                <UPopover v-model:open="actionsOpen">
                    <UButton color="neutral" variant="ghost" label="Actions" size="xs">
                        <template #trailing>
                            <UKbd value="meta" />
                            <UKbd value="k" />
                        </template>
                    </UButton>

                    <template #content>
                        <UCommandPalette
                            @update:searchTerm="value => {actionsSearchTerm = value;}"
                            :groups="props.actions"
                            :placeholder="actionsSearchPlaceholder"
                            @update:modelValue="args => {actionsOpen = false; if (props?.closeActions) props?.closeActions()}"
                        />
                    </template>
                </UPopover>
                <USeparator orientation="vertical" class="h-4" />
            </template>
            <UButton color="neutral" variant="ghost" label="Back to Menu" size="xs">
                <template #trailing>
                    <UKbd value="esc" />
                </template>
            </UButton>
        </div>
    </div>
</template>

<style scoped>

</style>