import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const createStore = () =>  new Vuex.Store({
    strict: true,
    state:{
        test: 1
    }
})