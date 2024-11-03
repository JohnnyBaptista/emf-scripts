import { Command } from "commander";
import { initProject } from "./commands/init";
// import { exposeComponent } from "./commands/expose";
import { importComponent } from "./commands/import";

const program = new Command();

program.name("emf").description("").version("0.1.0");

// Comando `init`
program
  .command("init")
  .description(
    "Inicializa um novo projeto React com configuração de Module Federation"
  )
  .option("-n, --name <projectName>", "Nome do projeto", "my-microfrontend-app") // Valor padrão: 'my-microfrontend-app'
  .option("-u, --url <projectUrl>", "URL do projeto", "http://localhost:3000/") // Valor padrão: 'http://localhost:3000/'
  .action((options) => {
    const { name, url } = options;
    initProject(name, url); // Passa os parâmetros para a função initProject
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
  .option(
    "-c, --component <componentName>",
    "Nome do componente a ser importado"
  )
  .option("-r, --remote <remoteName>", "Nome do remote onde o componente está")
  .option("-u, --url <remoteUrl>", "URL do remote")
  .action((options) => {
    importComponent(options.component, options.remote, options.url);
  });

program.parse(process.argv);
