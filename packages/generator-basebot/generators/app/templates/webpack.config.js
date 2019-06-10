const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'development',
  // entry: [
  //   'webpack-hot-client/client',
  //   './index.js'
  // ],
  entry: ['./index.js'],
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'main.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './build',
    stats: 'errors-only'
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [/node_modules/, /..\//],
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          failOnError: true,
          failOnWarning: false
        }
      },
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: [/node_modules/, /..\//],
        use: {
          loader: 'babel-loader',
          options: {
            presents: ['@babel/preset-env'],
            plugins: ['import-glob']
          }
        }
      }
    ]
  }
}
