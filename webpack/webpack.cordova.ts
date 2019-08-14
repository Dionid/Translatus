import path from "path"
// @ts-ignore
import MiniCssExtractPlugin from "mini-css-extract-plugin"
// @ts-ignore
import merge from "webpack-merge"
// @ts-ignore
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"
// @ts-ignore
import UglifyJsPlugin from "uglifyjs-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import commonConfig from "./webpack.common"
// @ts-ignore
import TerserPlugin from "terser-webpack-plugin"

const config = merge(commonConfig, {
    output: {
        path: path.resolve(__dirname, "../translatus_cordova/www"),
        filename: "[name].[chunkhash].js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
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
                                sourceMap: false,
                                // modules: true,
                            },
                    },
                ],
            },
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: "[hash:base64:8]",
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
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            // }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            // maxInitialRequests: Infinity,
            // minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module: any) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace("@", "")}`
                    },
                },
            },
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css",
        }),
        // new WriteFilePlugin(),
        // new CopyWebpackPlugin([{
        //     from: "public",
        // }]),
    ],
})

module.exports = config
