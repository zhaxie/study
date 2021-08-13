/** * webpack.config.js ** */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Alias = require('alias-jsconfig-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: resolve('src/index.jsx'),
  output: {
    path: resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader', 'astroturf/loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.less$/,
        exclude: '/node_modules',
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader', //
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '测试webpack',
      template: resolve('src/index.html'),
      filename: './index.html',
    }),
    new Alias({
      language: 'ts', // or 'ts'
      jsx: true, // default to true,
      indentation: 4, // default to 4, the indentation of jsconfig.json file
    }),
    new ESLintPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.tsx'],
    alias: {
      '@': resolve('src'),
      src: resolve('src'),
    },
  },
  devServer: {
    port: 3222,
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },
}
