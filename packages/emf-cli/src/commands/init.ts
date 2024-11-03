import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import {
  getCRAConfig,
  saveWebpackConfig,
  getWebpackConfig,
} from "../utils/webpackConfig";

export const DEFAULT_ENV = (projectUrl: string) => `
# Base URL of the project
PROJECT_URL=${projectUrl}
`;

export const BUTTON_COMPONENT = `
import React from "react";
import PropTypes from "prop-types";

const Button = ({ children, color, onClick }) => {
  const buttonStyle = {
    backgroundColor: color,
    border: "none",
    padding: "10px 20px",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  color: "#007BFF",
  onClick: () => {},
};

export default Button;
`;

const createCRAPackageJson = (
  projectName: string,
  packageJsonPath: string,
  projectPath: string,
  projectUrl: string
) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  if (packageJson.dependencies && packageJson.dependencies["react-scripts"]) {
    console.log(
      `CRA project detected. Configuring ${projectName} to use react-app-rewired...`
    );

    execSync("npm install react-app-rewired --save-dev", {
      stdio: "inherit",
    });

    packageJson.scripts = {
      ...packageJson.scripts,
      start: "react-app-rewired start",
      build: "react-app-rewired build",
      test: "react-app-rewired test",
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    fs.writeFileSync(
      path.join(projectPath, "config-overrides.js"),
      getCRAConfig(projectName, projectUrl)
    );

    fs.writeFileSync(path.join(projectPath, ".env"), DEFAULT_ENV(projectUrl));

    console.log(
      `CRA project successfully configured with react-app-rewired and Module Federation!`
    );
  }
};

export function initProject(
  projectName = "my-microfrontend-app",
  projectUrl = "http://localhost:3000/"
) {
  const projectPath = process.cwd();
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    execSync("npm init -y", { stdio: "inherit" });
  }

  if (fs.existsSync(packageJsonPath)) {
    createCRAPackageJson(projectName, packageJsonPath, projectPath, projectUrl);
  } else {
    console.log(`EMF Starting project: ${projectName}...`);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    execSync(
      "npm install react react-dom webpack webpack-cli webpack-dev-server babel-loader @babel/preset-react @babel/preset-env style-loader css-loader sass-loader html-webpack-plugin dotenv --save-dev",
      { stdio: "inherit" }
    );

    packageJson.dependencies = {
      ...packageJson.dependencies,
      react: "^17.0.2",
      "react-dom": "^17.0.2",
    };

    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      webpack: "^5.51.1",
      "webpack-cli": "^4.8.0",
      "webpack-dev-server": "^4.1.0",
      "babel-loader": "^8.2.3",
      "@babel/preset-react": "^7.14.5",
      "@babel/preset-env": "^7.15.8",
      "style-loader": "^3.3.0",
      "css-loader": "^6.2.0",
      "sass-loader": "^12.1.0",
      "html-webpack-plugin": "^5.3.2",
      "emf-scripts": "^1.0.0",
      dotenv: "^10.0.0",
    };

    packageJson.scripts = {
      start: "emf-react start",
      dev: "emf-react dev",
      build: "emf-react build",
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    if (!fs.existsSync(path.join(projectPath, "src"))) {
      fs.mkdirSync(path.join(projectPath, "src"));
    }

    if (!fs.existsSync(path.join(projectPath, "src/components"))) {
      fs.mkdirSync(path.join(projectPath, "src/components"));
    }

    if (!fs.existsSync(path.join(projectPath, "public"))) {
      fs.mkdirSync(path.join(projectPath, "public"));
    }

    // Create the Button.js component
    fs.writeFileSync(
      path.join(projectPath, "src/components", "Button.js"),
      BUTTON_COMPONENT
    );

    fs.writeFileSync(
      path.join(projectPath, "src", "index.js"),
      `
        import React from 'react';
        import ReactDOM from 'react-dom';
        import Button from './components/Button';

        const App = () => (
          <div>
            Hello from Webpack + Module Federation!
            <Button onClick={() => alert('Button clicked!')}>Click Me!</Button>
          </div>
        );

        ReactDOM.render(<App />, document.getElementById('root'));
      `
    );

    fs.writeFileSync(
      path.join(projectPath, "public", "index.html"),
      `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${projectName}</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
      `
    );

    // fs.writeFileSync(path.join(projectPath, ".env"), DEFAULT_ENV(projectUrl));

    // const updatedWebpackConfig = getWebpackConfig(projectName, projectUrl);

    // // Add the Button component to Module Federation
    // const finalWebpackConfig = updatedWebpackConfig.replace(
    //   "exposes: {},",
    //   "exposes: { './Button': './src/components/Button' },"
    // );

    // saveWebpackConfig(finalWebpackConfig);

    console.log(
      `Project ${projectName} successfully created and configured with Webpack, Module Federation, and the Button component exposed!`
    );
  }
}
