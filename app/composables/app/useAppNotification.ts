import {isPermissionGranted, type Options, requestPermission, sendNotification} from "@tauri-apps/plugin-notification";

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
            console.log('Requesting Permission...')
            const permission = await requestPermission();
            permissionGranted.value = permission === 'granted';
            console.log('Permission granted.')
        }
        return unref(permissionGranted)
    }

    async function notifyMessage(title: string, body: string) {
        if(!(await askPermIfNotGranted())) return;
        sendNotification({
            title: title,
            body: body
        })
    }

    async function notify(options: Options) {
        if(!(await askPermIfNotGranted())) return;
        sendNotification(options)
    }

    return {
        initialize,
        askPermIfNotGranted,
        notifyMessage,
        notify
    }
}