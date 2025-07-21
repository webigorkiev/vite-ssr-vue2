import type {Connect, ViteDevServer} from "vite";
import type {PluginOptionsInternal} from "@/types";
import type {Context} from "@/types";
import {promises as fs} from "fs";
import path from "path";
import {buildHtml} from "../utils/buildHtml";
import {cookieParse} from "../utils/cookieParser";
import * as http from "http";

// Read and transform index.html
const readIndexTemplate = async(server: ViteDevServer, url: string) => await server.transformIndexHtml(
    url,
    await fs.readFile(path.resolve(server.config.root, "index.html"), "utf-8")
);


// handler for dev server middleware
export const createHandler = (server: ViteDevServer, options: PluginOptionsInternal): Connect.NextHandleFunction => {

    return async(req, res, next) => {
        const response = res as http.ServerResponse & {redirect: (url: string, statusCode: 301|307) => void};
        if(req.method !== "GET" || !req.originalUrl) {
            return next();
        }
        response.redirect = (url: string, statusCode: 301|307 = 307) => {
            response.statusCode = statusCode;
            response.setHeader("location", url);
            response.end();
        };

        const error = (e: any, statusCode = 404) => {
            response.statusCode = statusCode;
            response.setHeader("content-type", "text/html; charset=utf-8");
            response.end(e.message);
        }

        try {
            const template = await readIndexTemplate(server, req.originalUrl);
            const entry = options.ssr;
            if(!entry) {
                response.statusCode = 200;
                response.end("");
                return;
            }
            const entryResolve = path.join(server.config.root, entry);
            const ssrMoudile = await server.ssrLoadModule(entryResolve);
            const render = ssrMoudile.default || ssrMoudile;
            const headers = req.headers as Record<string, any>;
            const protocol = server.config?.server?.https ? "https" : "";
            const context: Context = {
                hostname: headers.host,
                protocol: headers["x-forwarded-proto"] || protocol || "http",
                url: req.originalUrl || "/",
                cookies: cookieParse(headers["cookie"]),
                ip: headers["x-forwarded-for"]?.split(/, /)?.[0] || req.socket.remoteAddress,
                memcache: null,
                statusCode: 200,
                headers: req.headers,
                responseHeaders: {"content-type": "text/html; charset=utf-8"},
            };
            const htmlParts = await render(req.originalUrl, {
                req,
                res: response,
                context,
                manifest: options.manifest,
                logModules: options.logModules,
            });
            const html = buildHtml(template, htmlParts);
            response.statusCode = context.statusCode;
            Object.keys(context.responseHeaders).map(key => response.setHeader(key, context.responseHeaders[key]));
            response.end(html);
        } catch(e: any) {
            console.error(e);
            error(e); // Запрос в любос случае должен быть завешен
        }
    };
};