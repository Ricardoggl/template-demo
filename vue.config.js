'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// 如果您的端口设置为 80,
// 使用管理员权限执行命令行.
// 例如，Mac：sudo npm run
// 您可以通过以下方法更改端口:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9525 // dev port

// 可以在以下位置找到所有配置项目的说明 https://cli.vuejs.org/config/
module.exports = {
  /**
   * 如果您打算在子路径下部署站点，则需要设置publicPath,
   * 例如GitHub Pages.如果您打算将网站部署到 https://foo.github.io/bar/,
   * 则应该将publicPath设置为 "/bar/".
   * 在大多数情况下，请使用 '/' !!!
   * 详情: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, //process.env.NODE_ENV === 'development',  //是否开启eslint
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev-api': {
        target: 'http://www.baidu.com', //代理接口
        // target: 'http://192.168.101.113:7103', //代理接口
        // target: 'http://192.168.209.113:7103', //代理接口
        // target: 'http://192.168.201.77:32568', //代理接口
        changeOrigin: true,
        // ws: false,
        pathRewrite: {
          '^/dev-api': '' //代理的路径
        }
      },
    },
    //mock数据模拟
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 在webpack的名称字段中提供应用程序的标题，
    // 以便可以在index.html中对其进行访问以注入正确的标题.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // 它可以提高第一个屏幕的速度，建议打开预加载
    config.plugin('preload').tap(() => [{
      rel: 'preload',
      // 忽略 runtime.js
      // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }])

    // 当页面很多时，将导致太多毫无意义的请求
    config.plugins.delete('prefetch')

    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` 必须与runtimeChunk名称相同. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅打包最初依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为一个包
                  priority: 20, // 重量需要大于libs和app，否则将打包到libs或app中
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义您的规则
                  minChunks: 3, //  最小共同数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
