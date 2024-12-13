import type {Route} from "vue-router";
import path from "path";

// Находим необходимые фалы по роуту
// TODO работает только для dev сборки под Vite
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
        if(current.__file) { // Компонент без потомков
            files.push(path.relative(path.resolve(), current.__file));
        }
        if(current.components) {
            searchFiles(current.components, files, ++level);
        }
        if(current.options) {
            if(current.options.__file) {
                files.push(path.relative(path.resolve(), current.options.__file));
            }
            if(current.options.components && level < 2) {
                searchFiles(current.options.components, files, ++level);
            }
        }
    });
    return files;
}

// TODO нет __file если production