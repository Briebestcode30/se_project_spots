const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./scripts/index.js", // your main JS file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.[contenthash].js",
    assetModuleFilename: "images/[name].[hash][ext][query]", // images go to dist/images
    publicPath: "",
    clean: true, // clean dist before each build
  },

  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",

  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    liveReload: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // handle images correctly
        generator: {
          filename: "images/[name].[hash][ext]", // output folder for images
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)$/i,
        type: "asset/resource", // fonts
        generator: {
          filename: "fonts/[name].[hash][ext]",
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
    }),
  ],

  resolve: {
    extensions: [".js"], // resolve JS files automatically
  },
};
