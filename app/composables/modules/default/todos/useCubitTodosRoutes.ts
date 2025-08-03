import useCubitRoutes from "~/composables/general/useCubitRoutes";
import useWindowControl from "~/composables/utility/useWindowControl";

export default function useCubitTodosRoutes() {
    const $routes = useCubitRoutes()
    const $win = useWindowControl()

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