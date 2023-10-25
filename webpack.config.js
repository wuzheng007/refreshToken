// nodejs核心模块,用于处理文件路径问题
const path = require('path')
// webpack插件，会自动生成一个HTML5文件，在body中使用script标签引入webpackc生成的bundle
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack插件，用于检查代码是否符合eslint规范
const ESLintPlugin = require('eslint-webpack-plugin');
// webpack插件，用于分析打包后的文件大小
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 准备资源的压缩版本，以Content-Encoding为它们提供服务
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: 'production', // 打包模式 development(开发) production(生产),会使用相应的内置优化
  // 入口文件
  entry: './src/main.js',
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node-modules中的js文件（不处理这些文件）
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CompressionPlugin(),
    // 生成打包后的文件大小分析报告
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 生成html文件
      openAnalyzer: false // 不自动打开浏览器
    }),
    // 生成html文件
    new HtmlWebpackPlugin({
      // 指定生成的html文件的模板
      template: path.resolve(__dirname, 'public/index.html')
    }),
    // 检查代码是否符合eslint规范
    new ESLintPlugin({
      // 指定检查的文件
      context: path.resolve(__dirname, 'src')
    })
  ],
  // 开发服务器
  devServer: {
    port: 8000, // 指定端口号
    open: true, // 自动打开浏览器
    proxy: { // 代理
      '/api': { // 代理前缀
        target: 'http://localhost:8888', // 转发目标
        pathRewrite: { '^/api': '' }, // 路径重写
      },
    },
  },
  // 优化
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: 'async', // 异步代码分割
      minSize: 20000, // 代码分割的最小体积，达到这个体积才会进行代码分割
      minRemainingSize: 0, // 代码分割的最小剩余体积
      minChunks: 1, // 代码分割的最小chunks
      maxAsyncRequests: 30, //
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
