const webpack = require('webpack')
const path = require('path')
const loaders = require('./webpack.loaders')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const isProduction =  process.env.NODE_ENV === 'production';
const prettyPrint = require('html');

const plugins = [
  new WebpackCleanupPlugin(),
  new CopyWebpackPlugin([{
    from: 'src/assets/images/',
    to: 'assets/images',
  }], {
    copyUnmodified: true
  }),
  new CopyWebpackPlugin([{
    from: 'src/assets/fonts/',
    to: 'assets/fonts'
  }], {
    copyUnmodified: true
  }),
  new CopyWebpackPlugin([{
    from: path.join(__dirname, 'src'),
    to: path.join(__dirname, 'dist'),
    transform: function (content, path) {
      var html = content.toString('utf8').replace('</body>', '<script src="./assets/js/app.js?v=' + Date.now() + '"></script>\r\n</body>');
      var html = html.replace('<title>', '<link rel="stylesheet" href="./assets/css/app.css?v=' + Date.now() + '">\r\n<title>');
      var html = prettyPrint.prettyPrint(html, {indent_size: 4})
      return html;
    }
  }], {
    copyUnmodified: true
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      drop_console: true,
      drop_debugger: true,
    },
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new ExtractTextPlugin({
    filename: 'assets/css/app.css',
    allChunks: true,
  })
];

// push BrowserSyncPlugin if is production mode
if (!isProduction) {
  plugins.push(
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: ['dist']
      }
    })
  )
}

module.exports = {
  entry: [
    './src/assets/js/index',
    './src/assets/scss/main.scss',
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'dist'),
    filename: 'assets/js/app.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    loaders,
  },
  plugins: plugins,
}