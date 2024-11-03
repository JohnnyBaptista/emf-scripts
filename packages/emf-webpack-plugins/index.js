import ModuleFederation from "@module-federation/enhanced";
import RegisterComponentsPlugin from "./plugins/RegisterComponentsPlugin.js";

const ModuleFederationPlugin = ModuleFederation.ModuleFederationPlugin;

/**
 * Cria uma configuração de plugin ModuleFederationPlugin para o Webpack.
 *
 * @param {string} projectName - O nome do projeto. Deve ser uma string.
 * @returns {Object} - Um objeto de configuração contendo os plugins ModuleFederationPlugin e RegisterComponentsPlugin.
 */
export function getModuleFederationPlugin(projectName) {
  const moduleFederationPlugin = new ModuleFederationPlugin({
    name: `${projectName}`,
    filename: "remoteEntry.js",
    exposes: {
      // Exposições manuais podem ser misturadas com as dinâmicas
    },
    remotes: {},
    shared: {
      react: { singleton: true, eager: true },
      "react-dom": { singleton: true, eager: true },
    },
  });
  return {
    plugins: [
      moduleFederationPlugin,
      new RegisterComponentsPlugin(moduleFederationPlugin),
    ],
  };
}
