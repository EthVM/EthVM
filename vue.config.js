const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        lessPath: path.join(__dirname, '/src/css/less')
      }
    }
  }
}
