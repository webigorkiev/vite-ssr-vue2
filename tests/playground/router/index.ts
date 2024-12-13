import VueRouter from 'vue-router'

export const createRouter = () => new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: () => import("../views/Home.vue"),
            name: "Index",
            meta: {
                modules: [
                    "tests/playground/views/Home.vue"
                ]
            }
        },
        {
            path: '/test',
            component: () => import("../views/TestBaseWrapper.vue"),
            children: [
                {
                    path: '',
                    component: () => import("../views/Test.vue"),
                    name: "Test",
                }
            ]
        }
    ]
});