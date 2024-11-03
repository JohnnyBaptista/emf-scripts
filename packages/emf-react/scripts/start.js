import chalk from "chalk";
import webpack from "webpack";
import config from "../webpack.config.prod";

// Set the environment to production
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Makes the script crash on unhandled rejections instead of silently ignoring them.
process.on("unhandledRejection", (err) => {
  throw err;
});

(async () => {
  try {
    console.log(chalk.cyan("Building the application for production..."));

    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        console.error(chalk.red("Failed to compile:", err));
        process.exit(1);
      }

      if (stats.hasErrors()) {
        console.error(chalk.red("Compilation errors:"));
        console.error(
          stats.toString({ all: false, errors: true, warnings: true })
        );
        process.exit(1);
      }

      console.log(chalk.green("Compiled successfully!"));
      console.log(
        stats.toString({
          colors: true,
          all: false,
          modules: false,
          maxModules: 0,
          errors: false,
          warnings: false,
          assets: true,
          timings: true,
        })
      );

      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(chalk.red("Failed to close the compiler:", closeErr));
        }
      });
    });
  } catch (error) {
    console.error(chalk.red("Failed to build:", error));
    process.exit(1);
  }
})();
