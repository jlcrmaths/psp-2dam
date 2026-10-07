import { md, mdLinea } from './md.mjs';
import { pagina } from './pagina.mjs';

const NIVELES = [
  ['ligera', 'Pistas'],
  ['mas', 'Más ayuda'],
  ['paso', 'Paso a paso'],
];

export function analizarEnunciado(fuente, origen = 'enunciado.md') {
  let titulo = '';
  const intro = [];
  const ejercicios = [];
  const extras = [];
  let seccion = null;
  let ayuda = null;

  for (const linea of fuente.replace(/\r\n/g, '\n').split('\n')) {
    let m;
    if ((m = /^# (.+)/.exec(linea))) {
      titulo = m[1].trim();
      continue;
    }
    if ((m = /^## (.+)/.exec(linea))) {
      ayuda = null;
      const nombre = m[1].trim();
      if (/^Ejercicio\b/.test(nombre)) {
        seccion = { titulo: nombre, texto: [], ayudas: {} };
        ejercicios.push(seccion);
      } else {
        seccion = { titulo: nombre, texto: [] };
        extras.push(seccion);
      }
      continue;
    }
    if (seccion && seccion.ayudas && (m = /^### (.+)/.exec(linea))) {
      const nivel = NIVELES.find(([, nombre]) => nombre === m[1].trim());
      if (nivel) {
        ayuda = nivel[0];
        seccion.ayudas[ayuda] = [];
        continue;
      }
    }
    if (!seccion) intro.push(linea);
    else if (ayuda) seccion.ayudas[ayuda].push(linea);
    else seccion.texto.push(linea);
  }

  if (!ejercicios.length) {
    throw new Error(`${origen}: no hay ningún ejercicio ("## Ejercicio ...")`);
  }
  for (const e of ejercicios) {
    for (const [clave, nombre] of NIVELES) {
      const texto = (e.ayudas[clave] || []).join('\n').trim();
      if (!texto) {
        throw new Error(`${origen}: el ejercicio "${e.titulo}" no tiene "${nombre}"`);
      }
      if (texto.includes('```')) {
        throw new Error(`${origen}: "${nombre}" de "${e.titulo}" lleva código; las ayudas solo usan palabras`);
      }
      e.ayudas[clave] = texto;
    }
    e.texto = e.texto.join('\n').trim();
  }
  for (const x of extras) x.texto = x.texto.join('\n').trim();

  return { titulo, intro: intro.join('\n').trim(), ejercicios, extras };
}

export function paginaEnunciado(datos, base) {
  const ejercicios = datos.ejercicios
    .map((e, i) => {
      const id = `ej-${i + 1}`;
      const botones = NIVELES.map(
        ([, nombre], k) => `<button type="button" data-nivel="${k}" aria-expanded="false">${nombre}</button>`,
      ).join('');
      const ayudas = NIVELES.map(
        ([clave, nombre], k) => `<div class="ayuda" data-nivel="${k}"><h3>${nombre}</h3>${md(e.ayudas[clave])}</div>`,
      ).join('\n');
      return `<section class="ejercicio tarjeta" id="${id}" data-ejercicio="${id}">
<h2>${mdLinea(e.titulo)}</h2>
${md(e.texto)}
<div class="ayuda-botones" hidden>${botones}</div>
${ayudas}
</section>`;
    })
    .join('\n');
  const extras = datos.extras
    .map((x) => `<section class="tarjeta"><h2>${mdLinea(x.titulo)}</h2>${md(x.texto)}</section>`)
    .join('\n');
  return pagina({
    titulo: datos.titulo,
    base,
    scripts: ['estilo/ayudas.js'],
    cuerpo: `<h1>${mdLinea(datos.titulo)}</h1>\n${md(datos.intro)}\n${ejercicios}\n${extras}`,
  });
}
