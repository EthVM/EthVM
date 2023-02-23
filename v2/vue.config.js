const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { VuetifyPlugin } = require('webpack-plugin-vuetify')
const version = require('./package.json').version

const vars = {
    VERSION: version
}
const minOptions = {
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
    },
    generator: [
        {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: 'webp',
            implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
                encodeOptions: {
                    // Please specify only one codec here, multiple codecs will not work
                    webp: {
                        quality: 90
                    }
                }
            }
        }
    ]
}

module.exports = defineConfig({
    transpileDependencies: ['vuetify'],
    pluginOptions: {
        vuetify: {}
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
                },
                {
                    test: /\.(png|jpeg|jpg|gif|svg|webp)$/i,
                    loader: ImageMinimizerPlugin.loader,
                    enforce: 'pre',
                    type: 'asset/resource',
                    options: minOptions
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser'
            }),
            new VuetifyPlugin({
                styles: { configFile: 'src/styles/settings.scss' }
            }),
            new webpack.EnvironmentPlugin(vars)
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
        }
        // optimization: {
        //     minimizer: [new ImageMinimizerPlugin({})]
        // }
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
