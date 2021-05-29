import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'lib-flexible'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router, // 所有组件都能看到$router和$route  <route-link> 和 <route-view>
}).$mount('#app')
