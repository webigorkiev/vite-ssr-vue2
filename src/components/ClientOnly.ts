import Vue from 'vue'
export const ClientOnly =  Vue.extend({
    name: "ClientOnly",
    data() {
        return {
            show: false
        }
    },
    mounted() {
        this.show = true;
    },
    render: function (h) {
        return this.show ? h('div', this.$slots.default) : h('div');
    },
})