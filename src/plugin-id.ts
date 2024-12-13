import type {Plugin} from "vite";
import type {PluginOptions, PluginOptionsInternal} from "./types";
import {parseVueRequest} from "@vitejs/plugin-vue2";
import path from "path";
export type {PluginOptions, PluginOptionsInternal};

// Добавляет для серверной сборки специальное поле __id (ключ для manifest.json)
export default (): Plugin => {
    return {
        name: "vue-add-file",
        transform(code, id, opt) {
            const ssr = opt?.ssr === true;
            const { filename, query } = parseVueRequest(id);

            if (!query.vue && ssr && /\.vue$/.test(filename)) {
                const id = path.relative(path.resolve(), filename);
                code = code.
                replace(
                    /export\s+default\s+__component__\.exports(;)?/,
                    `__component__.options.__id = ${JSON.stringify(id)};`
                    + "\n"
                    + "export default __component__.exports;"
                );
                return{
                    code
                }
            }
        }
    };
};