import VueRouter from 'vue-router'

export const createRouter = () => new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: () => import("../views/Home.vue")
        },
        {
            path: '/test',
            component: () => import("../views/Test.vue")
        }
    ]
});