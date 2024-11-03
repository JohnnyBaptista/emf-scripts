
  
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const { ModuleFederationPlugin } = require('webpack').container;
    const dotenv = require('dotenv').config({ path: './.env' });

    module.exports = {
      entry: './src/index.js',
      mode: process.env.ENV || 'development',
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
};
