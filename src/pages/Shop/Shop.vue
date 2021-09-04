<template>
  <div id="shopContainer">
      <ShopHeader></ShopHeader>
      <div class="tabs">
          <div class="tab-item">
              <router-link :to="`/shop/${id}/goods`" replace>订餐</router-link>
          </div>
          <div class="tab-item">
              <router-link :to="`/shop/${id}/ratings`" replace>评价</router-link>
          </div>
          <div class="tab-item">
              <router-link :to="`/shop/${id}/info`" replace>商家</router-link>
          </div>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
import ShopHeader from '../../components/ShopHeader/ShopHeader.vue'
import {saveCartFoods} from '@/utils'
import {mapState} from 'vuex'
export default {
    name: 'Shop',

    props: ['id'],

    components: {
        ShopHeader,
    },

    mounted() {
        // this.$store.dispatch('getShopInfo')
        // this.$store.dispatch('getShopRatings')
        // this.$store.dispatch('getShopGoods')

        // 得到当前请求的商家ID
        //const id = this.$route.params.id
        const id = this.id
        // window.console.log(id)

        // 分发action请求商家数据
        this.$store.dispatch('getShop', id)

        // 给窗口绑定一个卸载的监听(刷新)
        window.addEventListener('unload', () => {
            const { shop:{id} , cartFoods} = this.shop // 多层解构

            // 将当前商家的购物车数据保存
            saveCartFoods(id, cartFoods)
        })
    },
    computed: {
        ...mapState({
            shop: state => state.shop // {shop: {}, cartFoods: []}
        })
    },
    // 退出当前商家界面时调用
    beforeDestroy() {

        const { shop:{id} , cartFoods} = this.shop // 多层解构

        // 将当前商家的购物车数据保存
        saveCartFoods(id, cartFoods)
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins'
#shopContainer
    .tabs
        display flex
        bottom-border-1px(#eee)
        .tab-item
            // width 33.3333%
            flex 1
            text-align center
            height 40px
            line-height 40px
            font-size 16px
            a
                display block
                position relative
                &.router-link-active
                    color $green
                    &:after
                        content ''
                        height 4px
                        width 40px
                        background $green
                        transform scaleY(0.5)
                        position absolute
                        bottom 0
                        left 50%
                        margin-left -20px

</style>