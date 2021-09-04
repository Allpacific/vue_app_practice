/* 包含n个接口请求函数的模块 */
import ajax from './ajax'

// 1.根据经纬度获取位置详情
export const reqAddress = (longitude, latitude) => ajax(`/position/${latitude},${longitude}`)

// 2.获取食品分类列表
export const reqCategorys = () => ajax('/index_category', {
    headers: {
        needToken: true
    }
})

// 3.根据经纬度获取商铺列表
export const reqShops = ({longitude, latitude}) => ajax('/shops', {
    params: {latitude, longitude},
    headers: {
        needToken: true
    }
})

// 4. 发送短信验证码
export const sendCode = ({phone}) => ajax('/sendcode', {params: {phone}})

// 5. 用户名密码登录
export const loginWithUsername = ({username, pwd, captcha}) => ajax({
    url: '/login_pwd',
    method: 'POST',
    data: {
        name: username,
        pwd,
        captcha
    }
})

// 6.手机号验证码登录
export const loginWithPhone = ({phone, code}) => ajax({
    url: '/login_sms',
    method: 'POST',
    data: {
        phone,
        code
    }
})

// 6.自动登录
export const autoLogin = () => ajax({
    url: '/auto_login',
    headers: {
        needToken: true
    }
})

// 获取goods
export const reqGoods = () => ajax('/goods')
// 获取ratings
export const reqRatings = () => ajax('/ratings')
// 获取info
export const reqInfo = () => ajax('/info')

// 获取指定shop
export const reqShop = (id) => ajax('/shop/' + id)