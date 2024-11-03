#!/usr/bin/env node
"use strict";
process.on("unhandledRejection", (err) => {
  throw err;
});

const args = process.argv.slice(2);

// Verifica qual script foi chamado (start ou dev)
const script = args[0];

// Importa os scripts de forma assíncrona
(async () => {
  if (script === "start") {
    const { default: start } = await import("../scripts/start.mjs");
    start();
  } else if (script === "dev") {
    const { default: dev } = await import("../scripts/dev.mjs");
    dev();
  } else {
    console.log(`Comando desconhecido: ${script}`);
    process.exit(1);
  }
})();
