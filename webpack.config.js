let VERSION = '1.3.0';
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'pc': './iui-webpack/entry.pc.js',
        'wap': './iui-webpack/entry.wap.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'iui.[name].js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('./[name].css')
    ],
    // externals: {
    //     // require("jquery") is external and available
    //     //  on the global var jQuery
    //     "jquery": "jQuery"
    // }
    module: {
        loaders: [{
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }, 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass?sourceComments=true')
            }
        ]
    },
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 9000,
        inline: true,
        host: '0.0.0.0'
    }
};
