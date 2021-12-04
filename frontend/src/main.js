import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
Vue.config.productionTip = false
Vue.use(ElementUI, {locale})

import router from '@/router'
import store from '@/store'

new Vue({
  el: '#app',
  render: h => h(App),
  components: { App },
  router,
  store,
}).$mount('#app')
