"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importComponent = importComponent;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpackConfig_1 = require("../utils/webpackConfig");
const dotenv_1 = __importDefault(require("dotenv"));
function importComponent(componentName, remoteName, remoteUrlParam) {
    // Carrega as variáveis do .env, se existir
    const envPath = path_1.default.join(process.cwd(), ".env");
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
    }
    // Pega a URL do .env (se disponível) ou usa um valor padrão se não for passado um parâmetro
    const remoteUrl = remoteUrlParam ||
        process.env.REMOTE_URL ||
        `http://localhost:3001/remoteEntry.js`;
    try {
        (0, webpackConfig_1.updateRemotes)(remoteName, remoteUrl);
        console.log(`Componente '${componentName}' importado com sucesso do remoto '${remoteName}' na URL '${remoteUrl}'!`);
    }
    catch (error) {
        console.error(`Erro ao importar o componente: ${error.message}`);
    }
}
