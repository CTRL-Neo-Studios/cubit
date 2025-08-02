import useWindowControl from "~/composables/utility/useWindowControl";

export default function () {
    const $win = useWindowControl()

    async function toMainMenu(recenterWindow?: boolean, resetWindowSize?: boolean) {
        if (resetWindowSize === true) await $win.resetWindowSizeToDefault()
        if (recenterWindow === true) await $win.centerWindow()
        await navigateTo('/')
    }

    return {
        toMainMenu
    }
}