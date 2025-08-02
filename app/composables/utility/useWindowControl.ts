import {getCurrentWindow, LogicalSize} from "@tauri-apps/api/window";
import {Size} from "@tauri-apps/api/dpi";

export default function () {
    const DEFAULT_WIDTH: number = 600
    const DEFAULT_HEIGHT: number = 300

    async function resetWindowSizeToDefault() {
        await getCurrentWindow().setSize(new LogicalSize(DEFAULT_WIDTH, DEFAULT_HEIGHT))
    }

    async function setWindowLogicalSize(size: LogicalSize, recenterWindow?: boolean) {
        await getCurrentWindow().setSize(size)
        if (recenterWindow) await centerWindow()
    }

    async function setWindowLogicalHeight(height: number, recenterWindow?: boolean) {
        const win = getCurrentWindow()
        await win.setSize(new Size(new LogicalSize((await win.innerSize()).toLogical(await win.scaleFactor()).width, height)));
        if (recenterWindow) await centerWindow()
    }

    async function setWindowLogicalWidth(width: number, recenterWindow?: boolean) {
        const win = getCurrentWindow()
        await win.setSize(new Size(new LogicalSize(width, (await win.innerSize()).toLogical(await win.scaleFactor()).height)));
        if (recenterWindow) await centerWindow()
    }

    async function getWindowLogicalSize() {
        const win = getCurrentWindow()
        return (await win.innerSize()).toLogical(await win.scaleFactor())
    }

    function getWindow() {
        return getCurrentWindow()
    }

    async function centerWindow() {
        return getWindow().center()
    }

    async function hideWindow() {
        await getWindow().hide()
    }

    return {
        resetWindowSizeToDefault,
        setWindowLogicalSize,
        setWindowLogicalHeight,
        setWindowLogicalWidth,
        getWindowLogicalSize,
        getWindow,
        centerWindow,
        hideWindow
    }
}