/* 
使用mockjs提供mock接口数据
 */
import Mock from 'mockjs'
import data from './data.json' // 得到的js对象（自动解析好了）
import shops from './shops.json'

// 定义mock接口
Mock.mock('/api/goods', {code: 0, data: data.goods})
Mock.mock('/api/ratings', {code: 0, data: data.ratings})
Mock.mock('/api/info', {code: 0, data: data.info})

// 根据请求id参数返回对应的商家数据
Mock.mock(/^\/api\/shop\/\d+$/, function(options){//  /api/shop/12

    // 得到请求params参数id
    const id = options.url.substring(10)
    // 找到对应的shops
    
    // shop.id 是number类型
    // id是字符串类型
    const shop = shops.find(shop => shop.id == id)

    // 根据请求路径中携带params参数
    // 返回一个动态数据
    return Mock.mock({code: 0, data: shop})
}) 


//export default ???