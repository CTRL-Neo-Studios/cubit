<script setup lang="ts">
import CubitModuleNavigationLayout from "~/components/Cubit/Layout/Module/CubitModuleNavigationLayout.vue";
import CubitModuleNavigationFooter from "~/components/Cubit/Layout/Module/CubitModuleNavigationFooter.vue";
import useCubitTodosStore from "~/composables/modules/default/todos/useCubitTodosStore";
import type {AcceptableValue, CommandPaletteGroup, CommandPaletteItem} from "@nuxt/ui";
import useCubitTodosRoutes from "~/composables/modules/default/todos/useCubitTodosRoutes";

const $todos = useCubitTodosStore()
const $troutes = useCubitTodosRoutes()
const actions = ref([
    {
        id: 'actions',
        items: [
            {
                label: 'New Todo',
                icon: 'i-lucide-plus',
                value: 'new-todo',
                kbds: ['meta', 'n'],
                onSelect() {
                    $troutes.toCreateTodoPage()
                }
            }
        ]
    }
])
const { data, pending, refresh } = await useAsyncData('app.data.modules.todos', async () => {
    await $todos.load()
    console.log('wtf')
    return {
        todos: $todos.todos,
        config: $todos.config,
        tags: $todos.tags
    }
})
const groups = ref<CommandPaletteGroup<CommandPaletteItem>[]>([])
const selectedEntry = ref()

onMounted(async () => {
    // await refresh()
})

watch(() => data, (newData) => {
    groups.value = [
        {
            id: 'uncategorized-todos',
            items: unref(unref(newData)?.todos)?.map(i => ({
                id: i.id || '',
                label: i.title,
                suffix: i.description,
                icon: i.icon,
                slot: 'uncategorized-todo' as const
            })) || []
        },
        {
            id: 'categorized-todos',
            label: 'Categorized',
            items: []
        }
    ]
}, {immediate: true})

async function onTodoSelected(entry: AcceptableValue | AcceptableValue[] | undefined) {
    selectedEntry.value = {}
    await $todos.toggleTodos([(((entry as any).id || '') as string)])
}
</script>

<template>
    <CubitModuleNavigationLayout
        :loading="pending"
        placeholder="Search for todo..."
        :groups
        :header="true"
        class="w-full h-full"
        v-model:selected-entry="selectedEntry"
        @update:selectedEntry="onTodoSelected"
        :permeated-slots="['uncategorized-todo']"
        footer
    >
        <template #footer="{actionsOpen, closeActions}">
            <CubitModuleNavigationFooter :actionsOpen :actions :closeActions/>
        </template>
        <template #uncategorized-todo="{ item }">
            <UCheckbox @change="args => { if(args) {$todos.checkTodos([item.id])} else {$todos.uncheckTodos([item.id])} }" :label="item.label" :description="item?.suffix" :model-value="$todos.isTodoChecked(item.id)"/>
        </template>
        <template #empty class="w-full h-full">
            <div class="w-full h-full flex items-center justify-center top-0 bottom-0 left-0 right-0">
                <div class="text-center text-muted flex-grow">No Todos. Use the Create Todo action to create one!</div>
            </div>
        </template>
    </CubitModuleNavigationLayout>
</template>

<style scoped>

</style>