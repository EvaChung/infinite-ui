let VERSION = '1.3.0';
let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let css = new ExtractTextPlugin('./[name].css');
module.exports = {
    entry: {
        'pc': './iui-webpack/entry.pc.js',
        'wap': './iui-webpack/entry.wap.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'iui.[name].' + VERSION + '.js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
        css
    ],
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        }, {
            test: /\.scss$/,
            use: css.extract({ fallbackLoader: 'style-loader', loader: ['css-loader', 'sass-loader'] })
        }]
    },
    devServer: {
      contentBase: __dirname,
      compress: true,
      port: 9000,
      inline:true,
      host:'0.0.0.0'
    }
};
