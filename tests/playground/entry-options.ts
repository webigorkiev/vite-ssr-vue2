import Vue from "vue";
import {defineOptions} from "vite-ssr-vue2";
import {createHead, Vue2ProvideUnheadPlugin} from "@unhead/vue";
import {createRouter} from "./router";
import {createStore} from "./store";
import VueRouter from "vue-router";
import Vuex from "vuex";

Vue.use(VueRouter);
Vue.use(Vuex);
const head = createHead();
Vue.use(Vue2ProvideUnheadPlugin, head)
Vue.use(head);

export default defineOptions({
   created({app, url}) {
      const head = createHead(); // Use only this instance (To avoid the state singleton)
      const router = createRouter();
      const store = createStore();

      return {head, router, store};
   }
});