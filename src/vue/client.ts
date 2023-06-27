import Vue from "vue";
import type {ClientHandler, Context, CreatorOptions} from "@/types";
import {unserialize} from "@/utils/serialize";
export type {Context, CreatorOptions};
import type {Store} from "vuex";
import type Router from "vue-router";

declare global {
    interface Window {
        __INITIAL_STATE__:any;
    }
}

// Create client instance of vue app
const createViteSsrVue:ClientHandler = async(App, options= {}) => {
    const serializer = options.serializer || unserialize;
    const initialState =  await serializer(window.__INITIAL_STATE__);
    const url = window.location;
    let store: Store<any>|undefined, router: Router|undefined, app: Vue|undefined;

    if(options.created) {
        ({store, router, app} = (await options.created({
            url,
            isClient: true,
            initialState: initialState
        })) || {});
    }
    const vueIns = app || new Vue({
        ...(router ? {router}:{}),
        ...(store ? {store}:{}),
        render: (h) => h(App)
    });
    if(router) {
        await new Promise(
            resolve => (router as Router).onReady(() => resolve(true), (e: any) => {
                throw e;
            })
        );
    }
    if(options.mounted) {
        await options.mounted({
            url,
            app: vueIns,
            isClient: true,
            initialState: initialState,
            store,
            router
        });
    }
    if(store && initialState.state) {
        store.replaceState(initialState.state);
    }
    vueIns.$mount(options?.mount?.rootContainer||"#app", options?.mount?.hydrating ?? true);
};
export default createViteSsrVue;