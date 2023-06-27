<template>
    <div class="container">
        <a href="https://vitejs.dev" target="_blank">
            <img src="../assets/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
        <h1>Vite + VUE2</h1>
        <h2>Vite ⚡ - Vue2 - TS - VueRouter - Vuex - Sass</h2>
        <h4>{{count}}</h4>
        <button @click="add">Count++</button>
        <ClientOnly>
            ClientOnly
        </ClientOnly>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {ClientOnly} from "vite-ssr-vue2";

    export default Vue.extend({
        components: {ClientOnly},
        data() {
            return {
                count: 0,
            };
        },
        methods: {
            add() {
                console.log("add");
                this.count++;
            },
        },
    });
</script>

<style lang="scss" scoped>
    .container {
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
    }

    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }

    .logo.vue:hover {
      filter: drop-shadow(0 0 2em #42b883aa);
    }
</style>
