import {load, LazyStore} from "@tauri-apps/plugin-store";
import type {CubitModuleTodosConfig, CubitTodo} from "~~/types/modules/cubit-modules.types";
import defaultCubitModuleTodosConfig from "~/utils/defaults/defaultCubitModuleTodosConfig";
import useUuid from "~/composables/utility/useUuid";
import type {DeepPartial} from "#ui/types";
import useAppNotification from "~/composables/app/useAppNotification";
import {today, getLocalTimeZone, CalendarDate, type DateValue} from '@internationalized/date'
import {isBefore, isBetween} from 'reka-ui/date'
import useQuickToasts from "~/composables/utility/useQuickToasts";

export default function useCubitTodosStore() {
    const $notif = useAppNotification()
    const $qt = useQuickToasts()

    const $keywords = {
        'store.fileName': 'todos.json',
        'store.keys.content': 'todos',
        'store.keys.config': 'config'
    }

    const $store = new LazyStore($keywords['store.fileName'], {autoSave: true})
    const $content = useState<CubitTodo[]>('app.modules.todo.content', () => [])
    const $config = useState<CubitModuleTodosConfig>('app.modules.todo.config', () => defaultCubitModuleTodosConfig())
    const $groupTagsIndex = useState<string[]>('app.modules.todo.groupTagsIndex', () => [])

    async function save() {
        await $store.set($keywords['store.keys.content'], unref($content))
        await $store.set($keywords['store.keys.config'], unref($config))
        await $store.save()
    }

    async function load() {
        let dirty: boolean = false
        const fetchedContent = await $store.get<CubitTodo[]>($keywords['store.keys.content'])
        const fetchedConfig = await $store.get<CubitModuleTodosConfig>($keywords['store.keys.config'])

        if (!fetchedContent) {
            await $store.set($keywords['store.keys.content'], [])
            dirty = true
        }
        if (!fetchedConfig) {
            await $store.set($keywords['store.keys.config'], defaultCubitModuleTodosConfig())
            dirty = true
        }

        $groupTagsIndex.value = indexGroupTags()

        if (dirty) await save()

        $content.value = fetchedContent || []
        $config.value = fetchedConfig || defaultCubitModuleTodosConfig()

        indexGroupTags()

        await notifyExpiredTodos()
    }

    async function addTodos(todos: Omit<CubitTodo, 'id'>[], refreshIndex: boolean = true) {
        const withIds = todos.map(t => ({
            ...t,
            id: useUuid()
        }))
        $content.value.push(...withIds)

        if (refreshIndex)
            indexGroupTags()

        await save()
    }

    async function removeTodos(todos: (CubitTodo | string)[], refreshIndex: boolean = true) {
        const toDelete = new Set(
            todos.map(t => (typeof t === 'string' ? t : t.id))
        )
        $content.value = $content.value.filter(t => !toDelete.has(t.id))

        if (refreshIndex)
            indexGroupTags()
    }

    async function updateTodos(updates: (DeepPartial<CubitTodo> & { id: string })[]) {
        const patchMap = new Map(updates.map(u => [u.id, u]))

        for (let i = 0; i < $content.value.length; i++) {
            const patch = patchMap.get($content.value[i]!.id)
            if (patch) {
                $content.value[i] = { ...$content.value[i]!, ...patch }
            }
        }
        await save()
    }

    function indexGroupTags(): string[] {
        const seen = new Set<string>()

        for (const todo of unref($content)) {
            const tag = todo.groupTag?.trim()
            if (!tag) continue

            seen.add(tag) // full tag
            // add every parent segment: School/Assignments/Test → School, School/Assignments
            let slice = ''
            for (const part of tag.split('/')) {
                slice = slice ? `${slice}/${part}` : part
                seen.add(slice)
            }
        }

        return Array.from(seen).sort((a, b) => a.localeCompare(b))
    }

    function isTodoChecked(todoId: string): boolean {
        return unref($content)
            .find(i => i.id == todoId && i.checked) != undefined
    }

    async function checkTodos(todos: (CubitTodo | string)[]) {
        const toCheck = new Set(todos.map(t => (typeof t === 'string' ? t : t.id)))
        let changed = false

        $content.value.forEach(todo => {
            if (toCheck.has(todo.id) && !todo.checked) {
                todo.checked = true
                changed = true
            }
        })

        if (changed) await save()
    }

    async function uncheckTodos(todos: (CubitTodo | string)[]) {
        const toUncheck = new Set(todos.map(t => (typeof t === 'string' ? t : t.id)))
        let changed = false

        $content.value.forEach(todo => {
            if (toUncheck.has(todo.id) && todo.checked) {
                todo.checked = false
                changed = true
            }
        })

        if (changed) await save()
    }

    async function toggleTodos(todos: (CubitTodo | string)[]) {
        const toToggle = new Set(todos.map(t => (typeof t === 'string' ? t : t.id)))
        let changed = false

        $content.value.forEach(todo => {
            if (toToggle.has(todo.id)) {
                todo.checked = !todo.checked
                changed = true
            }
        })

        if (changed) await save()
    }

    async function notifyExpiredTodos() {
        const now = new Date()

        // safest: create a JS-Date at 00:00 local time, then convert
        const expiredTodos = unref($content)?.filter(t => {
            if (!t.dueDate || t.checked) return false
            const dueDate = new Date(t.dueDate)
            return dueDate.getDay() < now.getDay()
        }), dueTodayTodos = unref($content)?.filter(t => {
            if (!t.dueDate || t.checked) return false
            const dueDate = new Date(t.dueDate)
            return dueDate.getDay() == now.getDay()
        })


        if (expiredTodos.length > 0) {
            $qt.info(`You have ${expiredTodos.length} expired todo(s).`)
            await $notif.notify({
                title: 'Cubit',
                body: `You have ${expiredTodos.length} expired todo(s).`
            });
        }


        if (dueTodayTodos.length > 0) {
            $qt.info(`You have ${dueTodayTodos.length} todo(s) due today.`)
            await $notif.notify({
                title: 'Cubit',
                body: `You have ${dueTodayTodos.length} todo(s) due today.`
            });
        }
    }

    return {
        todos: $content,
        config: $config,
        tags: $groupTagsIndex,
        save,
        load,
        addTodos,
        removeTodos,
        updateTodos,
        indexGroupTags,
        isTodoChecked,
        checkTodos,
        uncheckTodos,
        toggleTodos,
        notifyExpiredTodos
    }
}