import Vue from 'vue'
import 'lib-flexible'
import {Button} from 'mint-ui'
import VueLazyload from 'vue-lazyload/'

import './veeValidate'
import App from './App.vue'
import router from './router'
import Header from './components/Header/Header'
import CartControl from './components/CartControl/CartControl'
import store from './vuex/store'
import i18n from './i18n'
import './mock/mock-server'
import loading from '@/common/images/loading.gif'
import Split from './components/Split/Split.vue'
import './filters' // 加载自定义过滤器

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading, // 在要显示的图片没有加载到前显示
}) // 内部定义了一个全局指令lazy

// 注册全局组件
Vue.component('Header', Header)
Vue.component(Button.name, Button)
Vue.component('CartControl', CartControl)
Vue.component('Split', Split)

Vue.prototype.$eventBus = new Vue()

new Vue({
  render: h => h(App),

  // 所有组件都能看到 $router和$route  <route-link> 和 <route-view>
  router,

  i18n,

  // 所有组件都能看到：$store
  store
}).$mount('#app')
