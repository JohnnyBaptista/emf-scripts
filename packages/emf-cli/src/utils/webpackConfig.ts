import fs from "fs";
import path from "path";

export const getCRAConfig = (projectName: string, projectUrl: string) => `
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

export const getWebpackConfig = (projectName: string, projectUrl: string) => `
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

// Caminho do arquivo webpack.config.js
const getWebpackConfigPath = () =>
  path.join(process.cwd(), "webpack.config.js");

// Função para ler e retornar a configuração do Webpack
export function readWebpackConfig() {
  const configPath = getWebpackConfigPath();
  if (!fs.existsSync(configPath)) {
    throw new Error(
      "webpack.config.js não encontrado. Por favor, inicialize o projeto com `emf init`."
    );
  }

  const webpackConfig = fs.readFileSync(configPath, "utf-8");
  return webpackConfig;
}

// Função para salvar o conteúdo atualizado no webpack.config.js
export function saveWebpackConfig(updatedConfig: string) {
  const configPath = getWebpackConfigPath();
  fs.writeFileSync(configPath, updatedConfig, "utf-8");
}

// Função para modificar o dicionário de exposes no Module Federation
export function updateExposes(exposeKey: string, exposeValue: string) {
  let webpackConfig = readWebpackConfig();

  // Expressão regular para encontrar o objeto exposes
  const exposesRegex = /exposes:\s*{([^}]*)}/;
  const match = exposesRegex.exec(webpackConfig);

  if (match) {
    const currentExposes = match[1];
    const newExposes = `${currentExposes}, '${exposeKey}': '${exposeValue}'`;
    webpackConfig = webpackConfig.replace(currentExposes, newExposes);
  } else {
    // Se não encontrar a configuração de exposes, adiciona-a
    webpackConfig = webpackConfig.replace(
      "exposes: {},",
      `exposes: { '${exposeKey}': '${exposeValue}' },`
    );
  }

  saveWebpackConfig(webpackConfig);
}

// Função para modificar o dicionário de remotes no Module Federation
export function updateRemotes(remoteName: string, remoteUrl: string) {
  let webpackConfig = readWebpackConfig();

  // Expressão regular para encontrar o objeto remotes
  const remotesRegex = /remotes:\s*{([^}]*)}/;
  const match = remotesRegex.exec(webpackConfig);

  if (match) {
    const currentRemotes = match[1];
    const newRemotes = `${currentRemotes}, '${remoteName}': '${remoteUrl}'`;
    webpackConfig = webpackConfig.replace(currentRemotes, newRemotes);
  } else {
    // Se não encontrar a configuração de remotes, adiciona-a
    webpackConfig = webpackConfig.replace(
      "remotes: {},",
      `remotes: { '${remoteName}': '${remoteUrl}' },`
    );
  }

  saveWebpackConfig(webpackConfig);
}
