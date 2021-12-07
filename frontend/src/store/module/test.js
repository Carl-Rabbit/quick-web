import {testService} from '@/service';

// initial state
const state = () => ({
  counter: 0,
  graph: undefined
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
  },
  fetchData({commit}) {
    testService.fetchData({commit}, resp => {
      commit('updateData', resp)
    })
  }
}

// mutations
const mutations = {
  changeCounter(state, newCounter) {
    state.counter = newCounter;
  },
  updateData(state, data){
    state.graph = data
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
