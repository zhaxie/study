const env = process.env.NODE_ENV

console.info('env-----------11111', env);

module.exports = {
    plugins: [env === 'production' ? require('autoprefixer') : null],
}
