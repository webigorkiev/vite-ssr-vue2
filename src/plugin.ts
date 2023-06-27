import type {Plugin, Connect, ResolvedConfig, UserConfig} from "vite";
import {createHandler} from "./serve/handler";

import type {PluginOptions, PluginOptionsInternal} from "./types";
export type {PluginOptions, PluginOptionsInternal};

export default (opt:PluginOptions = {}): Plugin => {
    const options = opt as PluginOptionsInternal;
    options.name = options.name || "vite-ssr-vue2";

    return {
        name: options.name,
        config(): UserConfig {

            return {
                ssr: {
                    noExternal: [options.name]
                }
            } as UserConfig;
        },
        async configResolved(config:ResolvedConfig) {
            config.logger.info("\n --- SSR ---\n");
        },
        async configureServer(server) {
            const handler = opt.serve ? opt.serve(server, options) : createHandler(server, options);

            return (): Connect.Server => server.middlewares.use(handler);
        }
    };
};