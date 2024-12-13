import type {SsrHandler, Context} from "@/types";
import {createRenderer} from "vue-server-renderer";
import {serialize} from "@/utils/serialize";
import {createUrl} from "@/utils/createUrl";
import {renderSSRHead} from "@unhead/ssr";
import {findDependencies, renderPreloadLinks, renderPrefetchLinks} from "@/utils/html";
import type {CreatorOptions} from "@/types";
import Router from "vue-router";
import Vue from "vue";
import {findFilesRoute} from "@/utils/findFilesRoute"

export type {Context, CreatorOptions};

// Create server instance of vue app
const createViteSsrVue:SsrHandler = (App, options: CreatorOptions = {}) => {

    // manifest - for prod build
    return async(url, {manifest, ...extra } = {}) => {
        const serializer = options.serializer || serialize;
        const ssrContext: {
            url: URL,
            isClient: boolean,
            initialState: Record<string, any>
            [key: string]: any
        } = {
            url: createUrl(url, `${extra.context.protocol}://${extra.context.hostname}`),
            isClient: false,
            initialState: {},
            ...extra,
        };
        const { head, router, store, inserts, context, app } =
        (options.created &&
            (await options.created({
                ...ssrContext,
            }))) ||
        {};
        const vueInst = app || new Vue({
            ...(options.rootProps ? {propsData: options.rootProps}: {}),
            ...(router ? {router}:{}),
            ...(store ? {store}:{}),
            render: (h) => h(App)
        });

        // Router default behavior
        if(router && url) {
            await router.push(url);
            await new Promise(
                resolve => (router as Router).onReady(() => resolve(true), (e: any) => {
                    throw e;
                })
            );
        }

        options.mounted && (await options.mounted({
            app: vueInst,
            router,
            store,
            ...ssrContext,
        }));

        // store default behavior
        if(store) {
            ssrContext.initialState.state = store.state; // TODO изменение initialState приводит к изменению store.state
        }

        const renderer = createRenderer()
        const body = inserts?.body || await renderer.renderToString(vueInst, Object.assign(ssrContext, context || {}));
        let headTags = inserts?.headTags || "",
            htmlAttrs = inserts?.htmlAttrs || "",
            bodyAttrs = inserts?.bodyAttrs || "",
            dependencies = inserts?.dependencies || [];

        // head default behavior
        if(head) {
            ({headTags, htmlAttrs, bodyAttrs} = await renderSSRHead(head));
        }

        if(extra.logModules) {
            console.log(findFilesRoute(vueInst.$route));
        }

        if(manifest) {
            // Возможно передать список модулей для роута в meta
            const modules = ssrContext.modules || vueInst.$route?.meta?.modules || findFilesRoute(vueInst.$route);
            const {preload, prefetch} = findDependencies(
                modules,
                manifest,
                options.shouldPreload,
                options.shouldPrefetch // Будет работать
            );
            dependencies =  preload;
            if(preload.length > 0) {
                const links = renderPreloadLinks(preload);
                headTags += (links.length ? "\n" + links.join("\n"): "");
            }

            if(prefetch.length > 0) {
                const links = renderPrefetchLinks(prefetch);
                headTags += links.length ? "\n" + links.join("\n") : "";
            }
        }

        // rendered hook
        options.rendered && (await options.rendered({
            app: vueInst,
            router,
            store,
            ...ssrContext,
        }));

        const initialState = await serializer(ssrContext.initialState || {});

        return {
            html: `__VITE_SSR_VUE_HTML__`,
            htmlAttrs,
            bodyAttrs,
            headTags,
            body,
            initialState,
            dependencies
        };
    };
};
export default createViteSsrVue;