/* 向外暴露路由器模块对象 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/vuex/store'

// 声明使用vue插件
Vue.use(VueRouter)

const router = new VueRouter({

    mode: 'history', // 路由路径中没有#

    // 项目中所有路由
    routes
})

/* 功能：进入a/b必须登录，如果没有登录自动跳转到登录 */
const paths = ['/a', '/b'] // 所有需要进行登录检查的路由路径数组

// 定义全局前置守卫
router.beforeEach((to, from, next) => {

    // 如果请求的路径需要检查
    const path = to.path
    if(paths.indexOf(path) !== -1) {
        // 如果没有登录，强制跳转到登录界面
        if(!store.state.user.token) {
            return next('/login')
        }
    }

    // 其他情况放行
    next()
})

export default router