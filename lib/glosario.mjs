import { escapar, md } from './md.mjs';
import { pagina } from './pagina.mjs';

const CAMPOS = ['Qué es', 'Para qué sirve', 'Ejemplo mínimo'];

export function analizarFicha(fuente, origen) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(fuente.replace(/\r\n/g, '\n'));
  if (!m) throw new Error(`${origen}: falta la cabecera con "nombre"`);
  const meta = {};
  for (const linea of m[1].split('\n')) {
    const i = linea.indexOf(':');
    if (i > 0) meta[linea.slice(0, i).trim()] = linea.slice(i + 1).trim();
  }
  if (!meta.nombre) throw new Error(`${origen}: la cabecera no tiene "nombre"`);

  const campos = {};
  let clave = null;
  for (const linea of m[2].split('\n')) {
    const h = /^## (.+)/.exec(linea);
    if (h) {
      clave = h[1].trim();
      campos[clave] = [];
    } else if (clave) {
      campos[clave].push(linea);
    }
  }
  for (const campo of CAMPOS) {
    const texto = (campos[campo] || []).join('\n').trim();
    if (!texto) throw new Error(`${origen}: falta "${campo}"`);
    campos[campo] = texto;
  }
  return {
    nombre: meta.nombre,
    que: campos[CAMPOS[0]],
    para: campos[CAMPOS[1]],
    ejemplo: campos[CAMPOS[2]],
    origen,
  };
}

export function reunirFichas(fichas) {
  const vistos = new Map();
  for (const f of fichas) {
    const k = f.nombre.toLowerCase();
    if (vistos.has(k)) {
      throw new Error(`término duplicado "${f.nombre}": ${vistos.get(k)} y ${f.origen}`);
    }
    vistos.set(k, f.origen);
  }
  const clave = (n) => n.toLowerCase().replace(/^[@.]/, '');
  return [...fichas].sort((a, b) => clave(a.nombre).localeCompare(clave(b.nombre), 'es'));
}

export function paginaGlosario(fichas, base) {
  const articulos = fichas
    .map(
      (f) => `<article class="ficha tarjeta" data-nombre="${escapar(f.nombre)}">
<h2><code>${escapar(f.nombre)}</code></h2>
<dl>
<dt>Qué es</dt><dd>${md(f.que)}</dd>
<dt>Para qué sirve</dt><dd>${md(f.para)}</dd>
<dt>Ejemplo mínimo</dt><dd>${md(f.ejemplo)}</dd>
</dl>
</article>`,
    )
    .join('\n');
  return pagina({
    titulo: 'Glosario PSP',
    base,
    scripts: ['estilo/glosario.js'],
    cuerpo: `<h1>Glosario PSP</h1>
<p class="suave">Términos de Java usados en las clases, en orden alfabético.</p>
<input id="buscar" type="search" placeholder="Buscar un término…" aria-label="Buscar un término">
<div id="lista" class="rejilla">
${articulos}
</div>
<p id="vacio" class="suave" hidden>Ningún término coincide.</p>`,
  });
}
