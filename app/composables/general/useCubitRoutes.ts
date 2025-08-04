import useAppWindow from "~/composables/app/useAppWindow";

export default function () {
    const $win = useAppWindow()

    async function toMainMenu(recenterWindow?: boolean, resetWindowSize?: boolean) {
        await navigateTo('/')
        if (resetWindowSize === true) await $win.resetWindowSizeToDefault()
        if (recenterWindow === true) await $win.centerWindow()
    }

    async function toModules(moduleId?: string) {
        await navigateTo('/cubit-modules' + (moduleId != null ? `/${moduleId}` : ''))
    }

    return {
        toMainMenu,
        toModules
    }
}