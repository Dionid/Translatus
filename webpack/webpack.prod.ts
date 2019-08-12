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
// @ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
// @ts-ignore
import MomentLocalesPlugin from "moment-locales-webpack-plugin"
// @ts-ignore
import ManifestPlugin from "webpack-manifest-plugin"
// @ts-ignore
import SWPrecacheWebpackPlugin from "sw-precache-webpack-plugin"
import commonConfig from "./webpack.common"

const config = merge(commonConfig, {
    output: {
        path: path.resolve(__dirname, "../prod"),
        filename: "[name].[contenthash].js",
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
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
            }),
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
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
        }),
        new MomentLocalesPlugin({
            localesToKeep: ["ru"],
        }),
        new ManifestPlugin({
            fileName: "asset-manifest.json", // Not to confuse with manifest.json
        }),
        new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: "service-worker.js",
            logger(message: string) {
                if (message.indexOf("Total precache size is") === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return
                }
                console.log(message)
            },
            minify: true, // minify and uglify the script
            navigateFallback: "/index.html",
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        }),
        new CopyWebpackPlugin([
            { from: "public" }, // define the path of the files to be copied
        ]),
        // new BundleAnalyzerPlugin(),
    ],
})

module.exports = config
