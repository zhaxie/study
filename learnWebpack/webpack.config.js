/*** webpack.config.js ***/
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    title: '峰笔',
    template: path.join(__dirname, "src/index.html"),
    filename: "./index.html"
});

process.env.NODE_ENV = 'development'

module.exports = [{
    entry: path.join(__dirname, "src/index.jsx"),
    mode: 'development',
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            use: "babel-loader",
            exclude: /node_modules/
        },
        {
            test: /\.jsx?$/,
            use: ['babel-loader', 'astroturf/loader'],
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader",
                'postcss-loader',
            ]
        }, {
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        }, {
            test: /\.less$/,
            exclude: '/node_modules',
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                {
                    loader: 'postcss-loader',
                },
                {
                    loader: 'less-loader',  // 
                }
            ]
        },
        ]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        extensions: [".js", ".jsx", '.scss']
    },
    devServer: {
        port: 3222
    },
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: 'all'
        }
    },
},
];
