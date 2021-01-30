const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build'),
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        // 使用多个loader用use
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        loader: 'url-loader',
        options: {
          // 限制图片大小，当小于8k时使用base64格式处理
          limit: 8 * 1024,
          name: '[hash:10].[ext]'
        }
      }, {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development'
}