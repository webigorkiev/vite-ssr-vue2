import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue2';
import ssr from "./src/plugin";
import * as path from "path";

export default defineConfig({
    logLevel: "info",
    resolve: {
        alias: [
            {
                find: /@\/(.*)/,
                replacement: path.resolve("./src") + "/$1"
            }
        ],
    },
    plugins: [ssr({ssr: "./tests/playground/entry-server"}), vue()]
});


