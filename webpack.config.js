const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs')
const PATHS = {
    src: path.join(__dirname, './server/src'),
    dist: path.join(__dirname, './server/public'),
}

const PAGES_DIR = `${PATHS.src}`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    entry: {
        admin: __dirname + "/server/src/script/admin.js",
        participant: __dirname + "/server/src/script/participant.js",
        participantGallery: __dirname + "/server/src/script/participantGallery.js",
        index: __dirname + "/server/src/script/index.js"
    }, // webpack entry point. Module to start building dependency graph
    output: {
        path: __dirname + '/server/public/', // Folder to store generated bundle
        filename: 'script/[name].js',  // Name of generated bundle after build
        publicPath: 'public/' // public URL of the output directory when referenced in a browser
    },
    module: {  // where we defined file patterns and their loaders
        rules: [
            {
                test: /\.less$/i,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                strictMath: true,
                                sourceMap: true,
                                sourceMapContents: false
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.pug$/,
                use : {
                    loader: 'pug-loader',
                }
            },
        ]
    },
   
    plugins: [  // Array of plugins to apply to build chunk
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace('.pug', '.html')}`,
            minify: false,
            inject: false,
        })),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery",
            "window.$": "jquery"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./server/src/img", to: "./img" },
            ],
        }),
    ],

};