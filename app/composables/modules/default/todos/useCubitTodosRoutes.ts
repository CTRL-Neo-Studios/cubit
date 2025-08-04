import useCubitRoutes from "~/composables/general/useCubitRoutes";
import useAppWindow from "~/composables/app/useAppWindow";

export default function useCubitTodosRoutes() {
    const $routes = useCubitRoutes()
    const $win = useAppWindow()

    async function toCreateTodoPage() {
        await $routes.toModules('todos/create')
    }

    async function toTodosPage() {
        await $routes.toModules('todos')
        await $win.resetWindowSizeToDefault()
        await $win.centerWindow()
    }

    return {
        toCreateTodoPage,
        toTodosPage
    }
}