import {testService} from '@/service';

// initial state
const state = () => ({
  counter: 0,
})

// getters
const getters = {
}

// actions
const actions = {
  updateCounter({ state, commit }) {
    testService.updateCounter({counter: state.counter}, resp => {
      commit('changeCounter', resp.counter);
    })
  }
}

// mutations
const mutations = {
  changeCounter(state, newCounter) {
    state.counter = newCounter;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
