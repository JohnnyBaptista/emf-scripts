"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeComponent = exposeComponent;
const webpackConfig_1 = require("../utils/webpackConfig");
function exposeComponent(componentPath) {
    const componentName = componentPath.split("/").pop()?.split(".")[0]; // Obtém o nome do componente
    if (!componentName) {
        console.error("Erro: Não foi possível determinar o nome do componente.");
        return;
    }
    try {
        (0, webpackConfig_1.updateExposes)(componentName, componentPath);
        console.log(`Componente '${componentName}' exposto com sucesso!`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Erro ao expor o componente: ${error.message}`);
        }
        else {
            console.error("Erro ao expor o componente: Erro desconhecido.");
        }
    }
}
