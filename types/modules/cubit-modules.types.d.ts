export interface CubitModulesConfig {
    addDefaultModules: boolean
}

export interface CubitModule {
    routePath?: string,
    moduleIcon: string | 'i-lucide-codesandbox',
    moduleName: string | 'Unnamed Module',
    moduleId: string | 'default-module-id' // Kebab case, alphanumeric
}