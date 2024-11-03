"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackConfig = exports.getCRAConfig = void 0;
exports.readWebpackConfig = readWebpackConfig;
exports.saveWebpackConfig = saveWebpackConfig;
exports.updateExposes = updateExposes;
exports.updateRemotes = updateRemotes;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getCRAConfig = (projectName, projectUrl) => `
  const { ModuleFederationPlugin } = require('webpack').container;

  module.exports = function override(config, env) {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: '${projectName}',
        filename: 'remoteEntry.js',
        exposes: {},
        remotes: {},
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
      })
    );
    return config;
  };
`;
exports.getCRAConfig = getCRAConfig;
const getWebpackConfig = (projectName, projectUrl) => `
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { ModuleFederationPlugin } = require('webpack').container;
  const dotenv = require('dotenv').config({ path: './.env' });

  module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
      publicPath: process.env.PROJECT_URL || '${projectUrl}',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 3000, 
    },
    module: {
      rules: [
        {
          test: /\\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
            },
          },
        },
        {
          test: /\\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new ModuleFederationPlugin({
        name: '${projectName}',
        filename: 'remoteEntry.js',
        exposes: {},
        remotes: {},
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
      }),
    ],
  };
`;
exports.getWebpackConfig = getWebpackConfig;
// Caminho do arquivo webpack.config.js
const getWebpackConfigPath = () => path_1.default.join(process.cwd(), "webpack.config.js");
// Função para ler e retornar a configuração do Webpack
function readWebpackConfig() {
    const configPath = getWebpackConfigPath();
    if (!fs_1.default.existsSync(configPath)) {
        throw new Error("webpack.config.js não encontrado. Por favor, inicialize o projeto com `emf init`.");
    }
    const webpackConfig = fs_1.default.readFileSync(configPath, "utf-8");
    return webpackConfig;
}
// Função para salvar o conteúdo atualizado no webpack.config.js
function saveWebpackConfig(updatedConfig) {
    const configPath = getWebpackConfigPath();
    fs_1.default.writeFileSync(configPath, updatedConfig, "utf-8");
}
// Função para modificar o dicionário de exposes no Module Federation
function updateExposes(exposeKey, exposeValue) {
    let webpackConfig = readWebpackConfig();
    // Expressão regular para encontrar o objeto exposes
    const exposesRegex = /exposes:\s*{([^}]*)}/;
    const match = exposesRegex.exec(webpackConfig);
    if (match) {
        const currentExposes = match[1];
        const newExposes = `${currentExposes}, '${exposeKey}': '${exposeValue}'`;
        webpackConfig = webpackConfig.replace(currentExposes, newExposes);
    }
    else {
        // Se não encontrar a configuração de exposes, adiciona-a
        webpackConfig = webpackConfig.replace("exposes: {},", `exposes: { '${exposeKey}': '${exposeValue}' },`);
    }
    saveWebpackConfig(webpackConfig);
}
// Função para modificar o dicionário de remotes no Module Federation
function updateRemotes(remoteName, remoteUrl) {
    let webpackConfig = readWebpackConfig();
    // Expressão regular para encontrar o objeto remotes
    const remotesRegex = /remotes:\s*{([^}]*)}/;
    const match = remotesRegex.exec(webpackConfig);
    if (match) {
        const currentRemotes = match[1];
        const newRemotes = `${currentRemotes}, '${remoteName}': '${remoteUrl}'`;
        webpackConfig = webpackConfig.replace(currentRemotes, newRemotes);
    }
    else {
        // Se não encontrar a configuração de remotes, adiciona-a
        webpackConfig = webpackConfig.replace("remotes: {},", `remotes: { '${remoteName}': '${remoteUrl}' },`);
    }
    saveWebpackConfig(webpackConfig);
}
