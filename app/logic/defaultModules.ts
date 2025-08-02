import type {CubitModule, CubitModulesConfig} from "~~/types/modules/cubit-modules.types";

export function defaultModules(config?: CubitModulesConfig): CubitModule[] {
    return [
        {
            moduleName: 'Calculator',
            moduleId: 'calculator',
            moduleIcon: 'i-lucide-calculator'
        },
        {
            moduleName: 'LaTeX Editor',
            moduleId: 'latex-editor',
            moduleIcon: 'i-lucide-sigma'
        }
    ]
}