const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const webpackCommon = {
  plugins: [ new VuetifyLoaderPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
  resolve: {
    extensions: ['.ts', '.vue', '.json'],
    alias: {
      '@app': path.join(__dirname, '/src/'),
      cssPath: path.join(__dirname, '/src/css'),
      vue$: 'vue/dist/vue.esm.js',
      vuex$: 'vuex/dist/vuex.esm.js'
    }
  }
}

const webpackDevelopment = {
}

const webpackProduction = {
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    namedModules: true,
    moduleIds: 'size',
    mangleWasmImports: true,
    splitChunks: {
      maxSize: 244000,
      minChunks: 1,
      cacheGroups: {
        vendors: {
          reuseExistingChunk: true
        }
      }
    }
  },
  // stats: {
  //   warningsFilter: /mini-css-extract-plugin[^]*Conflicting order between:/
  // }
}

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].hash = true
      return args
    })
    // Vue Loader
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()

    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  },
  configureWebpack: process.env.NODE_ENV === 'production' ? merge( webpackCommon, webpackProduction) : webpackCommon,
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    noInfo: true
  }
}
