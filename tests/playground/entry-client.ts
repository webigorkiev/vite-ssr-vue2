import Vue from "vue";

import App from "./App.vue";
import VCA, { createApp, h } from "@vue/composition-api";
import './css/style.scss'
import VueRouter from "vue-router";
import {createRouter} from "./router";
import {createStore} from "./store";

Vue.config.productionTip = false;

Vue.use(VCA);
Vue.use(VueRouter);
const app = createApp({
  router: createRouter(),
  store: createStore(),
  render: () => h(App),
});

app.mount("#app");
