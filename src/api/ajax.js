/* 
    对axios进行二次封装一个能发ajax请求的函数
    1. 统一处理请求异常
    2. 异步请求成功的数据不是response，而是response.data
    3. 对请求体参数进行urlencoded处理，而不是默认的json方式（后台接口不支持）
    4. 配置请求超时的时间
    5. 通过请求头携带token数据
    6. 请求loading
*/
import axios from 'axios'
import qs from 'qs'
import { Indicator } from 'mint-ui'
import router from '../router'

const instance = axios.create({
    // baseURL: 'http://localhost:4000', // 跨域请求问题
    baseURL: '/api', // 让代理服务器转发请求4000
    // 4. 配置请求超时的时间
    timeout: 20000 
})

// 添加请求拦截器
instance.interceptors.request.use((config)=>{

    // 显示请求loading
    Indicator.open()

    const data = config.data
    if(data instanceof Object) {
        // 3. 对请求体参数进行urlencoded处理，而不是默认的json方式（后台接口不支持）。json对象格式----->url-encoding形式
        config.data = qs.stringify(data)
    }

    // 携带token的方式：1. cookie 2.请求参数 3.请求头[authorization]
    let token = localStorage.getItem('token_key')

    // 判断当前的请求是否需要携带token
    if(config.headers.needToken) {
        if(token) {
            config.headers.authorization = token
        }else {
            throw Error('请先登录')
        }
    }
    
    return config
})

// 添加响应拦截器
instance.interceptors.response.use((response)=>{

    // 关闭请求loading
    Indicator.close()

    // 2.异步请求成功的数据不是response，而是response.data
    return response.data
}, (error)=>{

    // 关闭请求loading
    Indicator.close()

    // return new Promise.reject(error)

    // 默认会返回一个成功的promise实例，但没有数据

    
    if(!error.response) {// 请求拦截器 throw error会走这一步, 请求没有真正发送出去，在请求拦截器报的错
        alert(error.message)
        // 跳转到登录页
        // 如果已经是login页面就不需要跳转了
        // router.currentRoute代表是当前的路由信息对象
        if(router.currentRoute.path !== '/login') {
            router.replace('/login')
        }
    }else {// 发送请求后获取错误信息对象
        if(error.response.status === 401) {
            alert('token过期，重新登录')
            // 跳转至登录页
            if(router.currentRoute.path !== '/login') {
                router.replace('/login')
            }
        }else if(error.response.status === 404) {
            alert('请求资源未找到')
        }else {
            // 1.统一处理请求异常
            alert('请求出错：' + error.message)
        }
    }

    return new Promise(() => {}) // 返回一个pending状态的promise => 中断promise链
})

export default instance

