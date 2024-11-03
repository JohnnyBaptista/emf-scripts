"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUTTON_COMPONENT = exports.DEFAULT_ENV = void 0;
exports.initProject = initProject;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const webpackConfig_1 = require("../utils/webpackConfig");
const DEFAULT_ENV = (projectUrl) => `
# Base URL of the project
PROJECT_URL=${projectUrl}
`;
exports.DEFAULT_ENV = DEFAULT_ENV;
exports.BUTTON_COMPONENT = `
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
const createCRAPackageJson = (projectName, packageJsonPath, projectPath, projectUrl) => {
    const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, "utf-8"));
    if (packageJson.dependencies && packageJson.dependencies["react-scripts"]) {
        console.log(`CRA project detected. Configuring ${projectName} to use react-app-rewired...`);
        (0, child_process_1.execSync)("npm install react-app-rewired --save-dev", {
            stdio: "inherit",
        });
        packageJson.scripts = {
            ...packageJson.scripts,
            start: "react-app-rewired start",
            build: "react-app-rewired build",
            test: "react-app-rewired test",
        };
        fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "config-overrides.js"), (0, webpackConfig_1.getCRAConfig)(projectName, projectUrl));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, ".env"), (0, exports.DEFAULT_ENV)(projectUrl));
        console.log(`CRA project successfully configured with react-app-rewired and Module Federation!`);
    }
};
function initProject(projectName = "my-microfrontend-app", projectUrl = "http://localhost:3000/") {
    const projectPath = process.cwd();
    const packageJsonPath = path_1.default.join(projectPath, "package.json");
    if (!fs_1.default.existsSync(packageJsonPath)) {
        (0, child_process_1.execSync)("npm init -y", { stdio: "inherit" });
    }
    if (fs_1.default.existsSync(packageJsonPath)) {
        createCRAPackageJson(projectName, packageJsonPath, projectPath, projectUrl);
    }
    else {
        console.log(`EMF Starting project: ${projectName}...`);
        const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, "utf-8"));
        (0, child_process_1.execSync)("npm install react react-dom webpack webpack-cli webpack-dev-server babel-loader @babel/preset-react @babel/preset-env style-loader css-loader sass-loader html-webpack-plugin dotenv --save-dev", { stdio: "inherit" });
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
        fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        if (!fs_1.default.existsSync(path_1.default.join(projectPath, "src"))) {
            fs_1.default.mkdirSync(path_1.default.join(projectPath, "src"));
        }
        if (!fs_1.default.existsSync(path_1.default.join(projectPath, "src/components"))) {
            fs_1.default.mkdirSync(path_1.default.join(projectPath, "src/components"));
        }
        if (!fs_1.default.existsSync(path_1.default.join(projectPath, "public"))) {
            fs_1.default.mkdirSync(path_1.default.join(projectPath, "public"));
        }
        // Create the Button.js component
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "src/components", "Button.js"), exports.BUTTON_COMPONENT);
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "src", "index.js"), `
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
      `);
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "public", "index.html"), `
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
      `);
        // fs.writeFileSync(path.join(projectPath, ".env"), DEFAULT_ENV(projectUrl));
        // const updatedWebpackConfig = getWebpackConfig(projectName, projectUrl);
        // // Add the Button component to Module Federation
        // const finalWebpackConfig = updatedWebpackConfig.replace(
        //   "exposes: {},",
        //   "exposes: { './Button': './src/components/Button' },"
        // );
        // saveWebpackConfig(finalWebpackConfig);
        console.log(`Project ${projectName} successfully created and configured with Webpack, Module Federation, and the Button component exposed!`);
    }
}
