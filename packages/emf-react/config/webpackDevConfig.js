import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from "dotenv";
import { getModuleFederationPlugin } from "emf-webpack-plugins";

dotenv.config({ path: "./.env" });

const { plugins } = getModuleFederationPlugin("teste");

export default {
  entry: "./src/index.js",
  mode: "development",
  output: {
    publicPath: "/",
    path: path.resolve(path.dirname(new URL(import.meta.url).pathname), "dist"),
  },
  devServer: {
    static: {
      directory: path.join(
        path.dirname(new URL(import.meta.url).pathname),
        "public" // Altere de "dist" para "public"
      ),
    },
    port: 3000,
    historyApiFallback: true, // Certifique-se de que esta linha está presente
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    ...plugins,
  ],
};
