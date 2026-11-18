import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enlazarProyectos, generarProyecto, listarExamenes, listarProyectos } from './lib/netbeans.mjs';

const raiz = dirname(fileURLToPath(import.meta.url));
const destino = process.env.PSP_NETBEANS || join(homedir(), 'NetBeansProjects');
const plantilla = join(raiz, 'plantillas', 'netbeans');

// Orden en NetBeansProjects: U1/practicas, U1/examenes, U2/practicas...
const grupos = [
  ...listarProyectos(join(raiz, 'contenido')).map((p) => ({ ...p, tipo: 'practicas' })),
  ...listarExamenes(join(raiz, 'privado')).map((p) => ({ ...p, tipo: 'examenes' })),
];

for (const p of grupos) {
  if (generarProyecto(p.ruta, plantilla, p.nombre)) console.log(`Preparado para NetBeans: ${p.nombre}`);
}

let conflictos = [];
for (const clave of new Set(grupos.map((p) => `${p.unidad.toUpperCase()}/${p.tipo}`))) {
  const [unidad, tipo] = clave.split('/');
  const lista = grupos.filter((p) => p.unidad.toUpperCase() === unidad && p.tipo === tipo);
  const carpeta = join(destino, unidad, tipo);
  const r = enlazarProyectos({ proyectos: lista, destino: carpeta });
  console.log(`Enlaces en ${carpeta}: ${r.creados.length} nuevos, ${r.existentes.length} ya estaban.`);
  conflictos = conflictos.concat(r.conflictos.map((n) => `${clave}/${n}`));
}
if (conflictos.length) {
  console.error(`Conflicto (ya existe algo con ese nombre, no se ha tocado): ${conflictos.join(', ')}`);
  process.exit(1);
}
