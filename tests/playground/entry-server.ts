import ssr from "@/vue/server";
import options from "./entry-options";
import App from "./App.vue";

export default ssr(App, options);


