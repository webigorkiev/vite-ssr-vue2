import type {Route} from "vue-router";
import path from "path";

// Только для ssr, нужен plugin-id
export const findFilesRoute = (route?: Route): string[] => {
    const matched = route?.matched || [];
    return [...new Set(matched.reduce((ac, row) => {
        const files = searchFiles(row.components);
        ac.push(...files);
        return ac;
    }, [] as string[]))];
}

// Рекурсивный поиск фалов в компонентах
const searchFiles = (components: Record<string, any>, files: string[] = [], level = 0) => {
    Object.keys(components).forEach((key) => {
        const current = components[key];
        if(current.__id) { // Компонент без потомков
            files.push(current.__id);
        }
        if(current.components) {
            searchFiles(current.components, files, ++level);
        }
        if(current.options) {
            if(current.options.__id) {
                files.push(current.options.__id);
            }
            if(current.options.components && level < 2) {
                searchFiles(current.options.components, files, ++level);
            }
        }
    });
    return files;
}