<template>
  <div>
    <keep-alive exclude="Search, Shop"> <!-- 在它管理的路由间进行切换，路由不会死亡(vue自带的) -->
      <router-view></router-view>
    </keep-alive>
    <FooterGuide v-show="$route.meta.isShowFooter"></FooterGuide>
  </div>
</template>

<script>
import FooterGuide from '@/components/FooterGuide/FooterGuide.vue'
import {autoLogin} from './api'
import {RECEIVE_USER} from './vuex/mutation-types'
export default {

  async mounted () {
    // 通知action异步获取address并保存到state
    this.$store.dispatch('getAddress')
    let result = await autoLogin()
    // window.console.log(result)

    // 存入vuex中
    this.$store.commit(RECEIVE_USER, result.data)
  },

  components: {
    FooterGuide
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  
</style>