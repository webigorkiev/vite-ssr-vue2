import type Vue from "vue";
import type {Component} from "vue";
import type {Unhead} from "@unhead/vue";
import type Router from "vue-router";
import type {Store} from "vuex";
import type {Connect, ViteDevServer} from "vite";
export interface PluginOptions {
    name?:string,
    ssr?: string,
    custom?: {
        [key: string]: string
    }
    serve?: (server: ViteDevServer, options: PluginOptionsInternal) => Connect.NextHandleFunction,
    manifest?: Record<string, string[]>, // Возможна загрузка мнифеста
    logModules?: boolean, // Выводить в консоль список модулей по роуту // Для development
    [key: string]: any
}

export interface PluginOptionsInternal extends PluginOptions {
    name:string, // "vite-ssr-vue2"
}
/**
 * Context that used for render server entry point for development
 * It needs a production implementation for your environment.
 * The context will go to the created hook parameters of the plugin
 */
export interface Context {
    hostname: string, // hostname (example.com) as express req.hostname
    protocol: string, // protocol (http) as express req.protocol
    url: string, // string current url /search?q=something
    cookies: Record<string, any>, // this property is an object that contains cookies sent by the request
    ip: string, // remote address (127.0.0.1)
    memcache: number|null, // special property for using memcached
    statusCode: number, // response status code default 200
    headers: Record<string, any>, // Request headers
    responseHeaders: Record<string, any>, // Response headers
}
type HookResponse = void | {
    head?: Unhead,
    router?:Router,
    store?:Store<any>,
    inserts?: {
        htmlAttrs?:string,
        headTags?:string,
        bodyAttrs?:string,
        body?:string,
        dependencies?:Array<string>
    },
    context?:Record<string, any>,
    app?: Vue
}
export type Hook = (params: {
    app?: Vue
    url: URL | Location
    isClient: boolean
    initialState: Record<string, any>,
    context?: Context,
    [key: string]: any
}) => HookResponse | Promise<HookResponse>
export interface CreatorOptions {
    created?:Hook, // Fire when app instance created
    mounted?:Hook, // Fire after all internal operations, as router isReady
    rendered?:Hook, // After ssr rendered or after replace state in client
    serializer?: (
        state: any
    ) => any | Promise<any>, // allows you to override the default serialization
    shouldPreload?:(file: string, type: string) => boolean, // shouldPreload aka [shouldPreload](https://ssr.vuejs.org/api/#shouldpreload)
    shouldPrefetch?:(file: string, type: string) => boolean, // shouldPrefetch aka [shouldPrefetch](https://ssr.vuejs.org/api/#shouldprefetch)
    mount?: {
        rootContainer?:any,
        hydrating?: boolean // default true
    }, // vue mount options (for client side)
    rootProps?:Record<string, any>|null // vue root props
}
export type SsrRenderer = (
    url: string | URL,
    options?: {
        manifest?: Record<string, string[]>,
        [key: string]: any
    }
) => Promise<{ html: string; dependencies: string[] }>
export type ClientHandler = (
    App: Component,
    options?: CreatorOptions
) => Promise<void>
export type SsrHandler = (
    App: Component,
    options?: CreatorOptions
) => SsrRenderer