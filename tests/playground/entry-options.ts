import Vue from "vue";
import {defineOptions} from "vite-ssr-vue2";
import {createHead, HeadVuePlugin} from "@vueuse/head";
import {createRouter} from "./router";
import {createStore} from "./store";
import VueRouter from "vue-router";
import Vuex from "vuex";

Vue.use(VueRouter);
Vue.use(Vuex);
const head = createHead();
Vue.use(HeadVuePlugin, head)
Vue.use(head);

export default defineOptions({
   created({app, url}) {
      const head = createHead();
      const router = createRouter();
      const store = createStore();

      return {head, router, store};
   }
});