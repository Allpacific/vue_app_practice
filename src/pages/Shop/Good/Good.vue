<template>
    <div>
        <div id="goodContainer">
            <div class="leftContainer">
                <ul class="navList" ref="leftUl">
                    <!-- current -->
                    <li class="menu_item" v-for="(good, index) in goods" :key="good.name" 
                        :class="{current: index === currentIndex}" @click="clickItem(index)">
                        <span class="text bottom-border-1px">
                            <img class="icon" :src="good.icon" v-if="good.icon" style="width: 15px;height: 15px">
                            {{good.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="rightContainer">
                <div class="foods-wrapper">
                    <ul ref="rightUl">
                        <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
                            <h1 class="title">{{good.name}}</h1>
                            <ul>
                                <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index"
                                @click="showFood(food)">
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span></div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <CartControl :food="food"/>
                                    </div>
                                </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <ShopCart/>
        </div>
        <!-- 组件标签对象就是组件对象 -->
        <Food :food="food" ref="food"/>
    </div>
  
</template>

<script>
import BScroll from 'better-scroll'
import {mapState} from 'vuex'
import Food from '@/components/Food/Food'
import ShopCart from '@/components/ShopCart/ShopCart'
export default {
    components: {
        Food,
        ShopCart,
    },
    data() {
        return {
            // 1. 右侧列表滑动的Y轴坐标：scrollY 在滑动过程中不断改变
            scrollY: 0,
            // 2，右侧每个分类<li>的top值的数组tops：第一次列表显示后统计后面不再变化
            tops: [],
            index: '', // 左侧当前下标
            food: {}, // 需要显示的food
        }
    },
    mounted() {
        if(this.goods.length > 0) {
            this._initScroll()
            this._initTops()
        }
    },
    computed: {
        ...mapState({
            goods: state => state.shop.shop.goods || [],
        }),
        currentIndex() {
            let {scrollY, tops} = this
            let index = tops.findIndex((top, index) => scrollY >= top && scrollY < tops[index+1])

            // this.currentIndex !== index 不要在计算属性内部计算属性本身的值，死循环
            if(this.leftScroll && index !== this.index) {
                
                this.changeIndex(index)
                let li = this.$refs.leftUl.children[index]
                // scrollToElement滚动到指定的元素
                this.leftScroll.scrollToElement(li, 300)
            }

            return index
        },
    },
    watch: {
        goods () { // goods数据有了
            this.$nextTick(() => { // this.$nextTick组件下一次渲染完毕
               this._initScroll()
               this._initTops()
            })
        },
    },
    methods: {
        // 改变index下标
        changeIndex(index) {
            this.index = index
        },
        // 初始化滑动
        _initScroll() {
            if(!this.leftScroll) {
                this.leftScroll = new BScroll('.leftContainer', {
                scrollY: true, // 纵向滑动
                })
                this.rightScroll = new BScroll('.rightContainer', {
                    scrollY: true, // 纵向滑动
                    probeType: 1 // 非实时(低频触发) / 触摸
                    // probeType: 2 // 实时（高频触发） / 触摸
                    // probeType: 3 // 实时  三种触屏方式 ==>/ 触摸 / 惯性 / 编码
                })

                // 给右侧列表绑定scroll监听
                this.rightScroll.on('scroll', ({y}) => {
                    // window.console.log(y)
                    this.scrollY = Math.abs(y)
                })

                // 给右侧列表绑定scrollEnd监听
                this.rightScroll.on('scrollEnd', ({y}) => {
                    // window.console.log(y)
                    this.scrollY = Math.abs(y)
                })
            }else {
                this.leftScroll.refresh()
                this.rightScroll.refresh()
            }
        },
        // 统计右侧所有分类li的top的数组
        _initTops() {
            const tops = []
            let top = 0
            tops.push(top)

            // 伪数组变为真数组
            const lis = Array.prototype.slice.call(this.$refs.rightUl.children)
            // window.console.log(lis)
            lis.forEach(li => {
                top += li.clientHeight
                tops.push(top)
            });

            // 更新tops数据
            this.tops = tops
        },

        clickItem(index) {

            // 得到对应的top
            const top = this.tops[index]

            // 立即更新scrollY位目标值(立即选中当前分类项)
            this.scrollY = top

            // 让右侧列表滑动到对应位置
            this.rightScroll.scrollTo(0, -top, 300)
        },
        /* 
        父组件调用子组件的方法: ref
        子组件调用父组件的方法: props
         */
        showFood(food) {
            // 更新数据
            this.food = food
            // 显示food组件界面
            this.$refs.food.toggleShow()
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../common/stylus/mixins'
#goodContainer 
    display flex
    overflow hidden
    height calc(100vh - 224px - 50px)
    .leftContainer
        width 80px
        background #f3f5f7
        // vh,vw 视口单位 1vh=1%视口高度
        // calc可以动态计算高度，宽度
        // position absolute
        // bottom 0
        // top 224px
        // overflow hidden
        .navList
            li
                width 100%
                height 50px
                text-align center
                line-height 50px
                position relative
                &.current
                    position: relative
                    z-index: 10
                    margin-top: -1px
                    background: #fff
                    color: $green
                    font-weight: 700
                &:after
                    content ''
                    width 80%
                    height 1px
                    background rgba(7,17,27,0.1)
                    position absolute
                    bottom 0
                    left 10%
    .rightContainer
        width 295px
        .foods-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147, 153, 159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                bottom-border-1px(rgba(7, 17, 27, 0.1))
                &:last-child
                    border-none()
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        height: 14px
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .desc, .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .desc
                        line-height: 12px
                        margin-bottom: 8px
                    .extra
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            color: rgb(240, 20, 20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147, 153, 159)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px

</style>