"use strict";

import chalk from "chalk";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import config from "../config/webpackDevConfig.js";
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently ignoring them.
process.on("unhandledRejection", (err) => {
  throw err;
});

const DEFAULT_PORT = 3000;
const HOST = "localhost";

(async () => {
  try {
    console.log(chalk.cyan("Starting the development server..."));

    const compiler = webpack(config);
    const devServerOptions = {
      ...config.devServer,
      open: true,
    };

    const server = new WebpackDevServer(devServerOptions, compiler);

    await server.start();
    console.log(
      chalk.green(
        `Development server is running at http://${HOST}:${DEFAULT_PORT}`
      )
    );

    ["SIGINT", "SIGTERM"].forEach((sig) => {
      process.on(sig, () => {
        server.stop();
        process.exit();
      });
    });
  } catch (error) {
    console.error(chalk.red("Failed to start the development server:", error));
    process.exit(1);
  }
})();
