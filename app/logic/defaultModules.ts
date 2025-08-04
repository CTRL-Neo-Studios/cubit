import type {CubitModule, CubitModuleGroup, CubitModulesConfig} from "~~/types/modules/cubit-modules.types";

export function defaultModules(config?: CubitModulesConfig): CubitModuleGroup[] {
    return [
        {
            groupId: 'default-modules',
            groupName: 'Cubit Modules',
            groupIcon: 'i-lucide-codesandbox',
            modules: [
                {
                    moduleName: 'Calculator',
                    moduleId: 'calculator',
                    moduleIcon: 'i-lucide-calculator'
                },
                {
                    moduleName: 'LaTeX Editor',
                    moduleId: 'latex-editor',
                    moduleIcon: 'i-lucide-sigma'
                },
                {
                    moduleName: 'Todos',
                    moduleId: 'todos',
                    moduleIcon: 'i-lucide-codesandbox'
                }
            ]
        }
    ]
}