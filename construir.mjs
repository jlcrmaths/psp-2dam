import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { construir } from './lib/construir.mjs';

const raiz = dirname(fileURLToPath(import.meta.url));
try {
  const r = construir({ raiz, frase: process.env.PSP_FRASE });
  console.log(`Listo: ${r.unidades} unidades, ${r.apartados} apartados, ${r.terminos} términos.`);
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
