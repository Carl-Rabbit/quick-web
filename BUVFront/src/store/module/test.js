import {dataService} from '@/service';

// initial state
const state = () => ({
  counter: 0,
  graph: undefined,

  route: undefined, //需要route,丢一个route进去
  station: undefined,
  alldata: undefined,
  selectedRoute: undefined,

  contourList: undefined,

  currentTime: "06:00:00"
})

// getters
const getters = {
}

// actions
const actions = {
  fetchRoute({ commit }, ) {
    let st = new Date();
    dataService.fetchRouteData({ commit }, resp => {
      commit('updateRoute', resp)
      console.log("fetchRoute use time: ", new Date() - st)
    })
  },
  fetchAll({ commit }) {
    let st = new Date();
    dataService.fetchAll({ commit }, resp => {//获取到后端站点数据之后,传到resp,resp就是一个数组或者json数据
      commit('updateAll', resp)
      console.log("fetchAll use time: ", new Date() - st)
    })
  },
  fetchAllData({ commit }) {
    let st = new Date();
    dataService.fetchAllData({ commit }, resp => {//获取到后端站点数据之后,传到resp,resp就是一个数组或者json数据
      commit('updateAllData', resp)
      console.log("fetchAllData use time: ", new Date() - st)
    })
  }
}

// mutations
const mutations = {
  updateRoute(state, data) {//相当于action获取数据之后把数据赋值给了状态里的一个值
    state.route = data
    // console.log("abc", data)//上面定义的route变量,后端的数据已经丢到route里面了
  },
  updateAll(state, data) {
    state.station = data//把data数据丢到state里定义的
    // console.log("ccc", data)
  },
  updateAllData(state, data) {
    state.alldata = data//把data数据丢到state里定义的
  },
  selectRoute(state, data){
    if(state.selectedRoute == data){
      state.selectedRoute = undefined
    }else{
      state.selectedRoute = data
    }
  },
  setContour(state, data){
    state.contourList = data
  }
  ,
  setCurrentTime(state, data){
    state.currentTime = data
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
