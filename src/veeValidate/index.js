import Vue from 'vue'
import veeValidate from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'

Vue.use(veeValidate)

veeValidate.Validator.localize('zh_CN', {
    messages: zh_CN.messages,
    attributes: {
        phone: '手机号',
        code: '验证码',
        username: '用户名',
        pwd: '密码',
        captcha: '验证码',
    }
})


veeValidate.Validator.extend('phone', {
    validate: value => {
        return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
    },
    getMessage: field => field + '必须是11位手机号码'
})

veeValidate.Validator.extend('code', {
    validate: value => {
        return /^\d{4,6}$/.test(value)
    },
    getMessage: field => field + '必须是4~6位数字'
})