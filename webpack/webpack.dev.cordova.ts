// @ts-ignore
import CopyWebpackPlugin from "copy-webpack-plugin"
// @ts-ignore
import WriteFilePlugin from "write-file-webpack-plugin"
// @ts-ignore
import merge from "webpack-merge"
import commonConfig from "./webpack.common"
import {HotModuleReplacementPlugin} from "webpack"
import path from "path"

const config = merge(commonConfig, {
    output: {
        path: path.resolve(__dirname, "../kontrollpa/www"),
        filename: "[name].[hash].js",
    },
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    {
                        loader: "css-loader",
                        options: {
                            // importLoaders: 1,
                            // modules: true,
                            // localIdentName: "[folder]_[name]__[local]___[hash:base64:5]",
                        },
                    },
                    {
                        loader: "less-loader",
                        options:
                            {
                                javascriptEnabled: true,
                                sourceMap: true,
                                // modules: true,
                            },
                    },
                ],
            },
            {
                test: /\.(s*)css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: "[folder]_[name]__[local]___[hash:base64:5]",
                        },
                    },
                    {
                        loader: "sass-loader",
                        options:
                            {
                                sourceMap: true,
                                modules: true,
                            },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new WriteFilePlugin(),
        // new CopyWebpackPlugin([{
        //     from: "public",
        // }]),
    ],
    devServer: {
        contentBase: "./kontrollpa/www",
        compress: true,
        open: true,
        historyApiFallback: true,
        port: 8000,
        hot: true,
    },
})

module.exports = config
