// vue.config.js

const px2rem = require('postcss-px2rem') // postcss的一个插件
const path = require('path')

module.exports = {
  // runtimeCompiler: true,
  // lintOnSave: false, //关闭Eslint的规则
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          px2rem({
            remUnit: 37.5 //设计稿等分后的rem值 375/10
          })
        ]
      }
    }
  },

  configureWebpack: { //内部写webpack原生配置
    resolve: {
      extensions: ['.js', '.vue', '.json'], //可以省略后缀名
      alias: { // 路径别名
        // 'vue$': 'vue/dist/vue.esm.js' // 表示精准匹配 带vue编译器
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
      }
    }
  }
}