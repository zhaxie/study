const webpackMerge = require('webpack-merge')
const base = require('./webpack.base.js')

process.env.NODE_ENV = 'development'

module.exports = webpackMerge.merge(base, {
  mode: 'development',
})
