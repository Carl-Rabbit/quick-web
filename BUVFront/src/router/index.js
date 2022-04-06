import Vue from 'vue';
import VueRouter from 'vue-router';
import Page from "@/view/Page";

Vue.use(VueRouter)

const routes = [
  {path: '/test', component: Page},
  {path: '/', redirect: '/test'},
]

export default new VueRouter({
  mode: 'history',
  routes
})
