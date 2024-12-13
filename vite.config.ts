import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue2';
import ssr from "vite-ssr-vue2/plugin";
import ssrId from "vite-ssr-vue2/plugin-id";
import * as path from "path";
import * as fs from "fs";

export default defineConfig({
    logLevel: "info",
    publicDir: "./tests/playground/public",
    resolve: {
        alias: [
            {
                find: /@\/(.*)/,
                replacement: path.resolve("./src") + "/$1"
            }
        ],
    },
    plugins: [
        ssr({
            ssr: "./tests/playground/entry-server",
            manifest: JSON.parse(fs.readFileSync(path.resolve("./dist/client/ssr-manifest.json")).toString()),
            // logModules: true
        }),
        vue(),
        ssrId()
    ]
});


