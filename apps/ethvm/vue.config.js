const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.vue', '.json'],
      alias: {
        '@app': path.join(__dirname, '/src/'),
        '@shared': path.join(__dirname, '../server/src/'),
        lessPath: path.join(__dirname, '/src/css/less/'),
        vue$: 'vue/dist/vue.esm.js'
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
