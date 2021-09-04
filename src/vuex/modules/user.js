/* 
    用户模块相关数据管理
 */ 
import {
    RECEIVE_USER, 
    RECEIVE_TOKEN, 
    LOGOUT, 
} from '../mutation-types'
export default {
    state: {
        user: {}, // 用户信息
        token: '', // 用户的唯一标识
    },
    mutations: {
        [RECEIVE_USER] (state, user) {
            state.user = user
        },
        [RECEIVE_TOKEN] (state, token) {
            state.token = token
        },
        [LOGOUT] (state) {
            // 清空vuex中的用户数据
            state.user = {}
            state.token = ''
            // 清空localstorage中的token
            localStorage.removeItem('token_key')
        },
    },
    actions: {},
    getters: {}
}