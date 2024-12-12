import type {Route} from "vue-router";
import path from "path";

// Находим необходимые фалы по роуту
export const findFilesRoute = (route?: Route): string[] => {
    const matched = route?.matched || [];
    return matched.reduce((ac, row) => {
        Object.keys(row.components).forEach((key) => {
            const cmp = row.components[key];
            // @ts-ignore
            const file = cmp?.options?.__file;
            if(file) {
                ac.push(path.relative(path.resolve(), file));
            }
        });
        return ac;
    }, [] as string[]);
}