import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enlazarProyectos, generarProyecto, listarProyectos } from './lib/netbeans.mjs';

const raiz = dirname(fileURLToPath(import.meta.url));
const destino = process.env.PSP_NETBEANS || join(homedir(), 'NetBeansProjects');
const proyectos = listarProyectos(join(raiz, 'contenido'));

for (const p of proyectos) {
  if (generarProyecto(p.ruta, join(raiz, 'plantillas', 'netbeans'), p.nombre)) {
    console.log(`Preparado para NetBeans: ${p.nombre}`);
  }
}
const r = enlazarProyectos({ proyectos, destino });
console.log(`Enlaces en ${destino}: ${r.creados.length} nuevos, ${r.existentes.length} ya estaban.`);
if (r.conflictos.length) {
  console.error(`Conflicto (ya existe algo con ese nombre, no se ha tocado): ${r.conflictos.join(', ')}`);
  process.exit(1);
}
