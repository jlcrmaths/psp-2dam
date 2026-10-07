import {
  existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, readlinkSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const subcarpetas = (ruta) =>
  existsSync(ruta)
    ? readdirSync(ruta, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];

export function listarProyectos(raizContenido) {
  const proyectos = [];
  for (const u of subcarpetas(raizContenido)) {
    for (const a of subcarpetas(join(raizContenido, u))) {
      const carpeta = join(raizContenido, u, a, 'proyectos');
      for (const nombre of subcarpetas(carpeta)) {
        if (existsSync(join(carpeta, nombre, 'src'))) {
          proyectos.push({ nombre, ruta: join(carpeta, nombre) });
        }
      }
    }
  }
  return proyectos.sort((x, y) => x.nombre.localeCompare(y.nombre, 'es'));
}

function archivosJava(carpeta) {
  return readdirSync(carpeta, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivosJava(join(carpeta, e.name)) : e.name.endsWith('.java') ? [join(carpeta, e.name)] : [],
  );
}

export function claseMain(rutaProyecto) {
  const src = join(rutaProyecto, 'src');
  if (!existsSync(src)) return null;
  const principal = archivosJava(src).find((f) => f.endsWith('Principal.java'));
  if (!principal) return null;
  const paquete = /^package\s+([^;]+);/m.exec(readFileSync(principal, 'utf8'));
  return paquete ? `${paquete[1].trim()}.Principal` : 'Principal';
}

const ARCHIVOS = [
  'build.xml',
  'manifest.mf',
  'nbproject/build-impl.xml',
  'nbproject/genfiles.properties',
  'nbproject/project.xml',
  'nbproject/project.properties',
];

export function generarProyecto(rutaProyecto, plantilla, nombre, { forzar = false } = {}) {
  if (!forzar && existsSync(join(rutaProyecto, 'nbproject', 'project.xml'))) return false;
  const id = nombre.replace(/[^A-Za-z0-9]+/g, '_');
  const principal = claseMain(rutaProyecto) || '';
  mkdirSync(join(rutaProyecto, 'nbproject'), { recursive: true });
  for (const archivo of ARCHIVOS) {
    const texto = readFileSync(join(plantilla, archivo), 'utf8')
      .replaceAll('{{NOMBRE}}', nombre)
      .replaceAll('{{ID}}', id)
      .replaceAll('{{MAIN}}', principal);
    writeFileSync(join(rutaProyecto, archivo), texto);
  }
  return true;
}

export function enlazarProyectos({ proyectos, destino }) {
  const resultado = { creados: [], existentes: [], conflictos: [] };
  mkdirSync(destino, { recursive: true });
  for (const { nombre, ruta } of proyectos) {
    const enlace = join(destino, nombre);
    let estado = null;
    try { estado = lstatSync(enlace); } catch (e) {}
    if (!estado) {
      symlinkSync(ruta, enlace);
      resultado.creados.push(nombre);
    } else if (estado.isSymbolicLink() && readlinkSync(enlace) === ruta) {
      resultado.existentes.push(nombre);
    } else {
      resultado.conflictos.push(nombre);
    }
  }
  return resultado;
}
