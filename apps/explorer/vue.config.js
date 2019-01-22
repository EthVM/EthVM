const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.vue', '.json'],
      alias: {
        '@app': path.join(__dirname, '/src/'),
        cssPath: path.join(__dirname, '/src/css'),
        vue$: 'vue/dist/vue.esm.js'
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
