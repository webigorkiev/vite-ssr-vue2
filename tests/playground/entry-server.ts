import ssr from "vite-ssr-vue2/server";
import options from "./entry-options";
import App from "./App.vue";

export default ssr(App, options);


