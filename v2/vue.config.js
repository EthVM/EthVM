const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

module.exports = defineConfig({
    transpileDependencies: ['vuetify'],
    pluginOptions: {
        vuetify: {
            styles: 'expose',
            stylesTimeout: 20000
        }
    },
    parallel: process.env.NODE_ENV !== 'production',
    publicPath: process.env.VUE_APP_ROUTER_MODE === 'hash' ? './' : '/',
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.graphql$/,
                    use: 'graphql-tag/loader'
                },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                appendTsSuffixTo: [/\.vue$/]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser'
            })
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            extensionAlias: {
                '.js': ['.js', '.ts'],
                '.cjs': ['.cjs', '.cts'],
                '.mjs': ['.mjs', '.mts']
            },
            fallback: {
                http: require.resolve('stream-http'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert/')
            },
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '@module': path.resolve(__dirname, 'src/modules/'),
                '@view': path.resolve(__dirname, 'src/views/'),
                '@core': path.resolve(__dirname, 'src/core/'),
                '@apollo-types': path.resolve(__dirname, 'src/apollo/types/')
            }
        },
        optimization: {
            minimizer: [
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.squooshMinify,
                        options: {
                            encodeOptions: {
                                mozjpeg: {
                                    quality: 100
                                },
                                webp: {
                                    lossless: 1
                                },
                                avif: {
                                    cqLevel: 0
                                }
                            }
                        }
                    }
                })
            ]
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                return {
                    ...options,
                    reactivityTransform: true
                }
            })
    }
})
