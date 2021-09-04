<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">吃货外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on: isShowSms}" @click="isShowSms=true">短信登录</a>
            <a href="javascript:;" :class="{on: !isShowSms}" @click="isShowSms=false">密码登录</a>
          </div>
        </div>

        <!-- 手机号登录 -->
        <div class="login_content">
          <form>
            <div :class="{on: isShowSms}">
              <section class="login_message">
                <input name="phone" v-validate="'required|phone'" type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <span style="color: red" v-show="errors.has('phone')">{{errors.first('phone')}}</span>
                <!-- !isRightPhone 为false 所以不能用&& -->
                <button :disabled="!isRightPhone || countDownTime > 0" class="get_verification" 
                :class="{right_phone_number: isRightPhone}" @click.prevent="getCode">{{countDownTime ? `${countDownTime}s后可以重新获取` : '获取验证码'}}</button>
              </section>
              <section class="login_verification">
                <input v-model="code" name="code" v-validate="'required|code'" type="tel" maxlength="8" placeholder="验证码">
                <span style="color: red" v-show="errors.has('code')">{{errors.first('code')}}</span>
              </section>
              <section class="login_hint">
                温馨提示：未注册吃货外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>

            <!-- 用户名登录 -->
            <div :class="{on: !isShowSms}">
              <section>
                <section class="login_message">
                  <input v-model="username" name="username" v-validate="'required'" type="tel" maxlength="11" placeholder="手机/邮箱/用户名">
                  <span style="color: red" v-show="errors.has('username')">{{errors.first('username')}}</span>
                </section>
                <section class="login_verification">
                  <input v-model="pwd" name="pwd" v-validate="'required'" :type="isShowPwd ? 'text':'password'" maxlength="8" placeholder="密码">
                  <span style="color: red" v-show="errors.has('pwd')">{{errors.first('pwd')}}</span>
                  <div class="switch_button" :class="isShowPwd ? 'on': 'off'" @click="isShowPwd = !isShowPwd">
                    <div class="switch_circle" :class="{right: isShowPwd}"></div>
                    <span class="switch_text">{{isShowPwd ? '显示' : ''}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input v-model="captcha" name="captcha" v-validate="'required'" type="text" maxlength="11" placeholder="验证码">
                  <span style="color: red" v-show="errors.has('captcha')">{{errors.first('captcha')}}</span>
                  <img ref="captcha" @click="toggleCaptcha" class="get_verification" src="http://localhost:4000/captcha" alt="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit" @click.prevent="login">{{$t('login_login')}}</button>
          </form>
          <a href="javascript:;" class="about_us">{{$t('login_aboutUs')}}</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <div class="languageContainer">
        <mt-button type="primary" @click="toggleLanguage('zh_CN')">中文</mt-button>
        <mt-button type="primary" @click="toggleLanguage('en')">英文</mt-button>
        <mt-button type="primary" @click="toggleLanguage('japanese')">日文</mt-button>
      </div>
    </section>

</template>

<script>
import {sendCode, loginWithUsername, loginWithPhone} from '../../api'
import {Toast, MessageBox} from 'mint-ui'
export default {
  name: 'Login',
  data() {
    return {
      isShowSms: true, // true：显示短信登陆界面，false：显示密码登陆界面
      phone: '',
      isShowPwd: false, // 密码是否可见
      countDownTime: 0, // 倒计时的时间
      code: '', // 手机验证码
      username: '', // 用户名
      pwd: '', // 密码
      captcha: '' // 图片验证码
    }
  },

  computed: {
    // 是否是一个正确的手机号
    isRightPhone() {
      return /^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)
    }
  },

  methods: {
    // 切换验证码
    toggleCaptcha() {
      this.$refs.captcha.src = "http://localhost:4000/captcha?time=" + Date.now()
    },
    // 发送验证码
    async getCode() {
      // 重置倒计时的时间
      this.countDownTime = 5
      // 开启倒计时
      let intervalId = setInterval(() => {
        this.countDownTime--
        this.countDownTime === 0 && clearInterval(intervalId)
      }, 1000);

      // 发送请求 请求后台给手机发送验证码
      let result = await sendCode({phone: this.phone})
      // window.console.log(result);
      if(result.code === 0) {
        alert('短信已发送！')
      }else {
        alert(result.msg)
      }
    },
    // 登录
    async login() {
      // 1.前端验证
      let {isShowSms, phone, code, username, pwd, captcha} = this
      let names = isShowSms ? ['phone', 'code'] : ['username', 'pwd', 'captcha'] 
      const success = await this.$validator.validateAll(names) // 对所有表单进行验证
      if(success) { // 前端验证成功
        // 2. 后端验证

        // 1) 收集表单的数据
        // 2) 发送请求
        // 判断用户登录的方式
        let result
        if(isShowSms) {// 手机号/验证码登录
          result = await loginWithPhone({phone, code})
          if(result.code === 1) { // 登录失败
            MessageBox({
              title: '提示',
              message: '请输入正确的验证码'
            })
            // 清空之前的验证码
            this.code = ''
          }
        }else {// 用户名/密码登录
          result = await loginWithUsername({username, pwd, captcha})
          if(result.code === 1) { // 登录失败
            MessageBox({
              title: '提示',
              message: '请输入正确的用户名/密码/验证码'
            })
            // 更换验证码
            this.toggleCaptcha()
            // 清空之前的验证码
            this.captcha = ''
          }
        }

        // 统一处理登陆的情况
        if(result.code === 0) {
          // 登录成功
          // 跳转页面
          Toast({
            message: '登陆成功！',
            position: 'top',
            duration: 2000
          })

          this.$router.replace('/profile')
          
          // window.console.log(result.data)
          // 将用户数据保存到vuex中
          this.$store.dispatch('getUserInfo', result.data)
        }
      }else {// 前端验证失败
        alert('前端验证失败')
      }
    },
    
    toggleLanguage(language) {
      // 切换语言
      this.$i18n.locale = language
      // 将新语言保存到local
      localStorage.setItem('locale_key', language)
    }
  },

  // 在当前组件对象被创建前调用，不能直接访问this（不是组件对象）
  // 但可以通过next(component => {})，在回调函数中访问组件对象
  beforeRouteEnter(to, from , next) {

    next((component) => { // 回调函数在组件对象创建后回调执行
      const token = component.$store.state.user.token

      // 如果已经登录，强制跳转到个人中心
      if(token) {
        next('/profile')
      }else {
        // 否则，放行
        next()
      }
    })
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';
.loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone_number
                    color $green
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right 
                      transform translateX(27px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
      .languageContainer
        display flex
        margin-top 50px
        justify-content space-around
</style>