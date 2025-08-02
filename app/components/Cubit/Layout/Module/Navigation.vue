<script setup lang="ts">
import useCubitRoutes from "~/composables/general/useCubitRoutes";

const model = defineModel<string>({default: ''})

const $cr = useCubitRoutes()

const props = defineProps<{title?: string, placeholder?: string, header?: boolean, footer?: boolean}>()

defineShortcuts({
    'escape': {
        async handler() {
            await $cr.toMainMenu(true, true)
        },
        usingInput: true
    }
})

const groups = ref([
    {
        id: 'module',
        items: []
    }
])
</script>

<template>
    <div class="w-full h-full">
        <UCommandPalette
            :ui="{ root: 'h-screen!', content: 'h-full', empty: 'p-0' }"
            icon="i-lucide-arrow-left"
            :groups="groups"
            :disabled="!props?.header"
            @update:searchTerm="value => {model = value; console.log(value)}"
            :placeholder="props?.placeholder !== undefined ? props.placeholder : 'Back'">
            <template #empty>
                <slot/>
            </template>
            <template #footer>
                <div class="flex items-center justify-start gap-2">
                    <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-dimmed ml-1" />
                    <div class="text-left text-muted flex-grow text-sm" v-if="props?.title">{{props.title}}</div>
                    <div class="flex items-center gap-1">
                        <UButton color="neutral" variant="ghost" label="Actions" class="text-dimmed" size="xs">
                            <template #trailing>
                                <UKbd value="meta" />
                                <UKbd value="k" />
                            </template>
                        </UButton>
                        <USeparator orientation="vertical" class="h-4" />
                        <UButton color="neutral" variant="ghost" label="Back to Menu" class="text-dimmed" size="xs">
                            <template #trailing>
                                <UKbd value="esc" />
                            </template>
                        </UButton>
                    </div>
                </div>
            </template>
        </UCommandPalette>
    </div>
</template>

<style scoped>

</style>