import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth/index.js'
import events from './events/index.js'
import bands from './bands/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingComponent: false,
  },
  mutations: {
    setLoadingComponent(state, payload) {
      state.loadingComponent = payload;
    }
  },
  actions: {
    setLoadingComponent(ctx, payload) {
      ctx.commit('setLoadingComponent', payload);
    }
  },
  getters: {
    loadingComponent(state) {
      return state.loadingComponent;
    }
  },
  modules: {
    auth,
    events,
    bands
  }
})
