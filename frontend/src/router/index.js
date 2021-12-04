import Vue from 'vue';
import VueRouter from 'vue-router';
import TestPage from "@/view/TestPage";

Vue.use(VueRouter)

const routes = [
  {path: '/test', component: TestPage},
  {path: '/', redirect: '/test'},
]

export default new VueRouter({
  mode: 'history',
  routes
})
