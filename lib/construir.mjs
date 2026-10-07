import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { analizarEnunciado, paginaEnunciado } from './enunciado.mjs';
import { analizarFicha, paginaGlosario, reunirFichas } from './glosario.mjs';
import { leerUnidades, paginaIndice } from './indice.mjs';
import { md } from './md.mjs';
import { cifrar, paginaNotas } from './notas.mjs';
import { paginaPresentacion, renderPresentacion } from './presentacion.mjs';

function escribir(ruta, texto) {
  mkdirSync(join(ruta, '..'), { recursive: true });
  writeFileSync(ruta, texto);
}

function construirGlosario(raiz, salida) {
  const carpeta = join(raiz, 'glosario');
  const fichas = existsSync(carpeta)
    ? readdirSync(carpeta)
        .filter((n) => n.endsWith('.md'))
        .sort()
        .map((n) => analizarFicha(readFileSync(join(carpeta, n), 'utf8'), `glosario/${n}`))
    : [];
  escribir(join(salida, 'glosario', 'index.html'), paginaGlosario(reunirFichas(fichas), '../'));
  return fichas.length;
}

function construirApartado({ raiz, salida, u, a, frase }) {
  const destino = join(salida, u.id, a.id);
  const base = '../../';
  a.enlaces = [];

  const pres = join(a.ruta, 'presentacion.md');
  if (existsSync(pres)) {
    const secciones = renderPresentacion(readFileSync(pres, 'utf8'), join(a.ruta, 'proyectos'), pres);
    escribir(join(destino, 'presentacion.html'), paginaPresentacion({ titulo: a.titulo, secciones, base }));
    a.enlaces.push({ texto: 'Presentación', archivo: 'presentacion.html' });
  }

  const enun = join(a.ruta, 'enunciado.md');
  if (existsSync(enun)) {
    const datos = analizarEnunciado(readFileSync(enun, 'utf8'), enun);
    escribir(join(destino, 'enunciado.html'), paginaEnunciado(datos, base));
    a.enlaces.push({ texto: 'Enunciado', archivo: 'enunciado.html' });
  }

  const notas = join(raiz, 'privado', u.id, a.id, 'notas-profesor.md');
  if (existsSync(notas)) {
    if (!frase) {
      throw new Error(`hay notas del profesor (${notas}) y no hay código de acceso. Define la variable PSP_FRASE.`);
    }
    const paquete = cifrar(md(readFileSync(notas, 'utf8')), frase);
    escribir(join(destino, 'notas-profesor.html'), paginaNotas({ titulo: a.titulo, paquete, base }));
    a.enlaces.push({ texto: 'Notas', archivo: 'notas-profesor.html', candado: true });
  }
}

export function construir({ raiz, frase }) {
  const salida = join(raiz, 'docs');
  const unidades = leerUnidades(join(raiz, 'contenido'));
  rmSync(salida, { recursive: true, force: true });
  mkdirSync(salida, { recursive: true });
  cpSync(join(raiz, 'estilo'), join(salida, 'estilo'), { recursive: true });
  writeFileSync(join(salida, '.nojekyll'), '');

  const terminos = construirGlosario(raiz, salida);
  let apartados = 0;
  for (const u of unidades) {
    for (const a of u.apartados) {
      construirApartado({ raiz, salida, u, a, frase });
      apartados++;
    }
  }
  escribir(join(salida, 'index.html'), paginaIndice(unidades));
  return { unidades: unidades.length, apartados, terminos };
}
