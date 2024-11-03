"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = require("./commands/init");
// import { exposeComponent } from "./commands/expose";
const import_1 = require("./commands/import");
const program = new commander_1.Command();
program.name("emf-cli").description("").version("0.1.0");
// Comando `init`
program
    .command("init")
    .description("Inicializa um novo projeto React com configuração de Module Federation")
    .option("-n, --name <projectName>", "Nome do projeto", "my-microfrontend-app") // Valor padrão: 'my-microfrontend-app'
    .option("-u, --url <projectUrl>", "URL do projeto", "http://localhost:3000/") // Valor padrão: 'http://localhost:3000/'
    .action((options) => {
    console.log("entrou");
    const { name, url } = options;
    (0, init_1.initProject)(name, url); // Passa os parâmetros para a função initProject
});
// // Comando `expose`
// program
//   .command("expose")
//   .description("Expõe um componente no Module Federation")
//   .option("-c, --component <componentPath>", "Caminho para o componente")
//   .action((options) => {
//     exposeComponent(options.component);
//   });
// Comando `import`
program
    .command("import")
    .description("Importa um componente remoto via Module Federation")
    .option("-c, --component <componentName>", "Nome do componente a ser importado")
    .option("-r, --remote <remoteName>", "Nome do remote onde o componente está")
    .option("-u, --url <remoteUrl>", "URL do remote")
    .action((options) => {
    (0, import_1.importComponent)(options.component, options.remote, options.url);
});
program.parse(process.argv);
