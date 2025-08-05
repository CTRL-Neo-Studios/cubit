import type {CalendarDate} from "@internationalized/date";

export interface CubitModulesConfig {
    addDefaultModules: boolean
}

export interface CubitModuleGroup {
    groupId: string,
    groupName: string,
    groupIcon?: string,
    modules: CubitModule[]
}

export interface CubitModule {
    routePath?: string,
    moduleIcon: string | 'i-lucide-codesandbox',
    moduleName: string | 'Unnamed Module',
    moduleId: string | 'default-module-id' // Kebab case, alphanumeric
}

export interface CubitTodo {
    id: string,
}

export interface CubitTodo {
    id: string,
    title: string,
    icon?: string,
    description?: string,
    groupTag?: string,
    dueDate?: CalendarDate,
    checked: boolean,
}

export interface CubitModuleTodosConfig {
    notifyOnTodoExpire: boolean
}