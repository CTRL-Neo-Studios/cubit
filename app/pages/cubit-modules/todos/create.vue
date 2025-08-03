<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'
import CubitModuleNavigationLayout from "~/components/Cubit/Layout/Module/CubitModuleNavigationLayout.vue";
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import * as z from 'zod';
import type {FormSubmitEvent} from "@nuxt/ui";
import useCubitTodosStore from "~/composables/modules/default/todos/useCubitTodosStore";
import useCubitTodosRoutes from "~/composables/modules/default/todos/useCubitTodosRoutes";
import useQuickToasts from "~/composables/utility/useQuickToasts";
import useWindowControl from "~/composables/utility/useWindowControl";
import CubitModuleNavigationFooter from "~/components/Cubit/Layout/Module/CubitModuleNavigationFooter.vue";

const $qt = useQuickToasts()
const $troutes = useCubitTodosRoutes()
const $todos = useCubitTodosStore()
const $win = useWindowControl()
const loading = ref(false)

onMounted(async () => {
    // await $win.setWindowLogicalHeight(400, true)
})

const schema = z.object({
    title: z.string(),
    description: z.string().nullable().nullish(),
    icon: z.string().nullable().nullish(),
    groupTag: z.string().nullable().nullish()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    title: undefined,
    description: undefined,
    icon: 'star',
    groupTag: undefined
})

const dueDate = ref(today(getLocalTimeZone()))

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    await createTodo()
}

async function createTodo() {
    loading.value = true
    try {
        await $todos.addTodos([{
            checked: false,
            icon: `i-lucide-${state.icon}` || 'i-lucide-star',
            title: state.title || 'Unnamed Todo',
            description: state.description || '',
            dueDate: unref(dueDate).toDate(getLocalTimeZone()),
            groupTag: state.groupTag || '',
        }])
        $qt.success('Successfully created a todo!')
    } catch (e: any) {
        $qt.error('Error', e.message);
    }
    loading.value = false
    await $troutes.toTodosPage()
}

function onCreateTag(item: string) {
    $todos.tags.value.push(item)
    state.groupTag = item
}

</script>

<template>
    <CubitModuleNavigationLayout
        footer
        :header="false"
        class="w-full h-full"
        :escape-handler="async () => {await $troutes.toTodosPage()}"
    >
        <ScrollAreaRoot class="w-full h-full">
            <ScrollAreaViewport class="w-full h-full rounded">
                <UForm :schema :state class="p-4 w-full h-full grid grid-cols-2 gap-2" @submit="onSubmit" loading-auto>
                    <UButton @click="createTodo" @submit="onSubmit" label="Create Todo" class="col-span-2 text-center justify-center"/>

                    <UFormField label="Title" name="title" class="w-full" required>
                        <UInput v-model="state.title" class="w-full" autofocus/>
                    </UFormField>
                    <UFormField label="Due Date" class="w-full">
                        <UPopover>
                            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" class="w-full">
                                {{ dueDate ? df.format(dueDate.toDate(getLocalTimeZone())) : 'Select a date' }}
                            </UButton>

                            <template #content>
                                <UCalendar v-model="dueDate" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Group Tag" name="groupTag" class="w-full">
                        <UInputMenu v-model="state.groupTag" @create="onCreateTag" :items="$todos.tags.value" class="w-full" />
                    </UFormField>
                    <UFormField label="Icon" name="icon" class="w-full">
                        <UInput
                            v-model="state.icon"
                            class="w-full"
                            :ui="{ base: 'pl-15.5', leading: 'pointer-events-none' }"
                        >
                            <template #leading>
                                <p class="text-sm text-muted">i-lucide-</p>
                            </template>
                        </UInput>
                    </UFormField>
                    <UFormField label="Description" name="description" class="w-full col-span-2">
                        <UTextarea v-model="state.description" class="w-full"/>
                    </UFormField>
                </UForm>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar
                class="flex select-none touch-none p-0.5 z-20 transition-colors duration-[160ms] ease-out hover:bg-blackA2 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="vertical"
            >
                <ScrollAreaThumb
                    class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
                />
            </ScrollAreaScrollbar>
        </ScrollAreaRoot>
        <template #footer>
            <CubitModuleNavigationFooter title="Create New Todo" />
        </template>
    </CubitModuleNavigationLayout>
</template>

<style scoped>

</style>