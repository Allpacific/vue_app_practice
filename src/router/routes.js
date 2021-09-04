/* 所有路由配置的数组 */
// import MSite from '@/pages/MSite/MSite' // 静态引入：打包时引入
// import Search from '@/pages/Search/Search'
// import Profile from '@/pages/Profile/Profile'
// import Order from '@/pages/Order/Order'
/* 
    路由组件懒加载：
        1).在打包时路由组件会被单独打包(代码分割：code split)
        2）. 默认不请求加载路由组件打包文件，当请求需要路由组件时才请求加载
    1.import 动态引入：import（模块路径）
      结果：被引入的模块会被单独打包(代码分割：code split)
    2. 配置的路由组件是函数（返回动态加载的路由组件模块）
        函数开始是不执行的（开始不请求加载单独打包的路由组件模块代码）
        当请求对应路径需要显示组件界面时，去加载路由组件打包文件

    作用：减小首屏需要加载的js文件 ==> 显示更快
 */

// const MSite = () => import('@/pages/MSite/MSite') // 下面简写
const Search = () => import('@/pages/Search/Search')
const Profile = () => import('@/pages/Profile/Profile')
const Order = () => import('@/pages/Order/Order')


import Login from '@/pages/Login/Login'
import Shop from '@/pages/Shop/Shop'

import Good from '@/pages/Shop/Good/Good'
import Info from '@/pages/Shop/Info/Info'
import Rating from '@/pages/Shop/Rating/Rating'

import A from '../pages/test/A.vue'
import B from '../pages/test/B.vue'
import B1 from '../pages/test/B1.vue'
import B2 from '../pages/test/B2.vue'


export default [
    {
        path: '/msite',
        // component: MSite,
        component: () => import('@/pages/MSite/MSite'),
        meta: {
            isShowFooter: true
        }
    },
    {
        path: '/search',
        component: Search,
        meta: {
            isShowFooter: true
        }
    },
    {
        path: '/order',
        component: Order,
        meta: {
            isShowFooter: true
        }
    },
    {
        path: '/profile',
        component: Profile,
        meta: {
            isShowFooter: true
        }
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/a',
        component: A
    }, 
    {
        path: '/b',
        component: B,
        children: [
            {
                path: '/b/b1',
                component: B1
            },
            {
                path: '/b/b2',
                component: B2
            },
        ]
    },
    {
        name: 'shop',
        path: '/shop/:id',
        props: true, // 将所有params参数转换成标签属性传递给子路由组件
        // props: toRoute => ({id: toRoute.params.id}),
        component: Shop,
        children: [
            {
                path: 'goods',
                component: Good,
            },
            {
                path: 'ratings',
                component: Rating,
            },
            {
                path: 'info',
                component: Info,
            },
            {
                path:'',
                redirect:'goods'
            }
        ]
    },
    {
        path: '/',
        redirect: 'msite'
    },
]