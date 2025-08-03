import type {CubitModuleTodosConfig} from "~~/types/modules/cubit-modules.types";

export default function (value?: Partial<CubitModuleTodosConfig>): CubitModuleTodosConfig {
    return {
        notifyOnTodoExpire: value?.notifyOnTodoExpire != null ? value.notifyOnTodoExpire : true
    } satisfies CubitModuleTodosConfig
}