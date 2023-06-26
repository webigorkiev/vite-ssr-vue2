import VueRouter from 'vue-router'

export const createRouter = () => new VueRouter({
    routes: [
        {
            path: '/',
            component: () => import("../views/Home.vue")
        }
    ]
});