import fs from "fs";
import path from "path";
import { updateRemotes } from "../utils/webpackConfig";
import dotenv from "dotenv";

export function importComponent(
  componentName: string,
  remoteName: string,
  remoteUrlParam?: string
) {
  // Carrega as variáveis do .env, se existir
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  // Pega a URL do .env (se disponível) ou usa um valor padrão se não for passado um parâmetro
  const remoteUrl =
    remoteUrlParam ||
    process.env.REMOTE_URL ||
    `http://localhost:3001/remoteEntry.js`;

  try {
    updateRemotes(remoteName, remoteUrl);
    console.log(
      `Componente '${componentName}' importado com sucesso do remoto '${remoteName}' na URL '${remoteUrl}'!`
    );
  } catch (error) {
    console.error(`Erro ao importar o componente: ${(error as Error).message}`);
  }
}
