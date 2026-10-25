// Genera simulador/prueba.html (página «Ponte a prueba») a partir de simulador/index.html.
// Uso: node simulador/generar-prueba.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
let html = readFileSync(join(dir, 'index.html'), 'utf8');

const cambia = (de, a) => {
  if (!html.includes(de)) throw new Error('No encuentro en index.html: ' + de.slice(0, 60));
  html = html.replace(de, () => a);
};

cambia('<title>Simulador de hilos</title>', '<title>Ponte a prueba</title>');
cambia('const SOLO_PRUEBA = false;', 'const SOLO_PRUEBA = true;');
cambia('<a class="volver" href="prueba.html">🎯 Ponte a prueba</a>', '<a class="volver" href="index.html">← Simulador de hilos</a>');
cambia('<body>', '<body class="soloprueba">');
cambia('<section class="sticky">', `<section class="sticky">
    <details class="panel exps" id="pruebaPanel" open>
      <summary>Ponte a prueba</summary>
      <div id="ppBox"></div>
    </details>`);
cambia('</style>', `.soloprueba #escenario, .soloprueba #bSol, .soloprueba #expPanel{display:none}
body.soloprueba:not(.pp-activo) main > section.right, body.soloprueba:not(.pp-activo) .sticky > :not(#pruebaPanel), body.soloprueba:not(.pp-activo) main > section:not(.sticky):not(.right){display:none}
body.soloprueba:not(.pp-activo) main{grid-template-columns:minmax(0,760px);justify-content:center}
</style>`);

writeFileSync(join(dir, 'prueba.html'), html);
console.log('simulador/prueba.html generado');
