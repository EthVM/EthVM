const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].hash = true
      return args
    })
  },
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.vue', '.json'],
      alias: {
        '@app': path.join(__dirname, '/src/'),
        cssPath: path.join(__dirname, '/src/css'),
        vue$: 'vue/dist/vue.esm.js',
        vuex$: 'vuex/dist/vuex.esm.js'
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    noInfo: true
  }
}
