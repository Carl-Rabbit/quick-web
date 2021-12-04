import Vue from 'vue';
import Vuex from 'vuex';
import test from './module/test';

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    test,
  },
  // strict: debug,
  strict: false,
})
