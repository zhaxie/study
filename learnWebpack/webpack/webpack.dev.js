
var merge = require('webpack-merge')
var base =  require('./webpack.base.js')

process.env.NODE_ENV = 'development'

module.exports = merge.merge(base, {
    mode: 'development',
})