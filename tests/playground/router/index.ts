import VueRouter from 'vue-router'

export const createRouter = () => new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: () => import("../views/Home.vue"),
            name: "Index"
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