const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => ({
  mode: "development",
  entry: {
    app: "./src/index.ts",
  },
  devServer: {
      static: path.join(__dirname, './'), // tell dev server where to serve content from 
      historyApiFallback: true
  },
  devtool: argv.mode === "production" ? "none" : "inline-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "./"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[a|c]ss$/,
        use: [
          { loader: "lit-scss-loader" },
          {
            loader: "extract-loader",
            // options: {
            //   esModule: false,
            // },
          },
          { loader: "css-loader",
            options: {
              esModule: false,
            }
          },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(png|gif|jpg|cur)$/i,
        loader: "url-loader",
        // type: 'asset/resource',
        options: { limit: 8192 },
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff2" },
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff" },
      },
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "file-loader",
        options: {
          esModule: false,
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
});
