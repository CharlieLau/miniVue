const webpackHtmlPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    resolve: {
        modules: [path.resolve(__dirname, 'lib'), path.resolve('node_modules')]
    },
    plugins: [
        new webpackHtmlPlugin({
            template: './index.html'
        })
    ]
}