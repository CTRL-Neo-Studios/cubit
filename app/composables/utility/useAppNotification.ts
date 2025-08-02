import {isPermissionGranted, requestPermission, sendNotification} from "@tauri-apps/plugin-notification";

export default function () {
    const permissionGranted = useState<boolean>('app.perms.notify.granted', () => false)

    async function initialize() {
        permissionGranted.value = await isPermissionGranted();

        if (!unref(permissionGranted)) {
            const permission = await requestPermission();
            permissionGranted.value = permission === 'granted';
        }
    }

    async function askPermIfNotGranted() {
        permissionGranted.value = await isPermissionGranted();

        if (!unref(permissionGranted)) {
            const permission = await requestPermission();
            permissionGranted.value = permission === 'granted';
        }
        return unref(permissionGranted)
    }

    async function notify(title: string, body: string) {
        if(!(await askPermIfNotGranted())) return;
        sendNotification({
            title: title,
            body: body
        })
    }

    return {
        initialize,
        askPermIfNotGranted,
        notify
    }
}