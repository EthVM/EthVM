const path = require('path')
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].hash = true
      return args
    })

    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  },
  configureWebpack: {
    plugins: [ new VuetifyLoaderPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new BundleAnalyzerPlugin()],
    resolve: {
      extensions: ['.ts', '.vue', '.json'],
      alias: {
        '@app': path.join(__dirname, '/src/'),
        cssPath: path.join(__dirname, '/src/css'),
        vue$: 'vue/dist/vue.esm.js',
        vuex$: 'vuex/dist/vuex.esm.js'
      }
    },
    optimization: {
      namedModules: true,
      moduleIds: 'size',
      mangleWasmImports: true,
      splitChunks: {
        maxSize: 244000,
        minChunks: 1,
        maxInitialRequests: 3,
        cacheGroups: {
          vendors: {
            reuseExistingChunk: true
          }
        }
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    noInfo: true
  }
}
