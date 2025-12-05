const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: "./scripts/index.js",
  },

  output: {
    path: path.resolve(__dirname, "se_spots_sprint4"),
    filename: "main.[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
    publicPath: "",
    clean: true,
  },

  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",

  devServer: {
    static: path.resolve(__dirname, "se_spots_sprint4"),
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    liveReload: true,
  },

  target: ["web", "es5"],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
    }),
  ],
};
