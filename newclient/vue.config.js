const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const version = require('./package.json').version
const vars = {
    VERSION: version,
    ROUTER_MODE: process.env.ROUTER_MODE || 'history'
}

const sourceMapsConfig = {
    filename: 'sourcemaps/[file].map'
}
sourceMapsConfig.exclude = /vendors.*.*/

const webpackCommon = {
    devtool: false,
    plugins: [new VuetifyLoaderPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.EnvironmentPlugin(vars)],
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

const webpackDevelopment = {}

const webpackProduction = {
    plugins: [new webpack.SourceMapDevToolPlugin(sourceMapsConfig)],
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
    }
}

module.exports = {
    publicPath: process.env.ROUTER_MODE === 'hash' ? './' : '/',
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
    configureWebpack: process.env.NODE_ENV === 'production' ? merge(webpackCommon, webpackProduction) : webpackCommon,
    devServer: {
        https: true,
        host: 'localhost',
        hotOnly: true,
        port: 3000
    }
}
