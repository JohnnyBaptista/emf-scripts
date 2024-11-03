import { getRegisteredComponents } from "emf-register";

class RegisterComponentsPlugin {
  constructor(moduleFederationPlugin) {
    this.moduleFederationPlugin = moduleFederationPlugin;
  }

  apply(compiler) {
    compiler.hooks.beforeRun.tap("RegisterComponentsPlugin", () => {
      const registeredComponents = getRegisteredComponents();

      if (registeredComponents.length > 0) {
        // Adiciona dinamicamente os componentes registrados ao objeto `exposes` do `ModuleFederationPlugin`
        registeredComponents.forEach(({ name, path }) => {
          if (!this.moduleFederationPlugin.options.exposes) {
            this.moduleFederationPlugin.options.exposes = {};
          }
          this.moduleFederationPlugin.options.exposes[`./${name}`] = path;
        });
      }
    });
  }
}

export default RegisterComponentsPlugin;
