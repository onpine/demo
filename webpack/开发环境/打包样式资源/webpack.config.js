const { resolve } = require('path')
module.exports = {
  // 入口
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  // loader配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  // plugins配置
  plugins: [

  ],
  mode: 'development'
}