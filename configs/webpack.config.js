var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: './src/main.ts',
    node: {
        fs: 'empty'
    },
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: '',
        filename: 'js/[name].[hash:7].js',
    },
    module: {
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [resolve('src')],
            options: {
                formatter: require('eslint-friendly-formatter'),
                emitWarning: false,
                fix: true
            }
        }, {
            test: /\.css$/,
            loader: 'css-loader',
            options: {}
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    ts: 'ts-loader',
                    less: 'vue-style-loader!css-loader!less-loader'
                }
            }
        }, {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/],
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: path.resolve(__dirname, '../dist/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: path.resolve(__dirname, '../dist/media/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: path.resolve(__dirname, '../dist/fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'lessPath': resolve('src/css/less'),
        }
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || '8080',
        open: false,
        overlay: {
            warnings: false,
            errors: true,
        },
        publicPath: '',
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: true,
        }
    },
    performance: {
        hints: false
    },
    devtool: '#source-map',
    plugins: [
        new CleanWebpackPlugin(['../dist/*.*'], {
            allowExternal: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]
}