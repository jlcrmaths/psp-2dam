import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { escapar } from './md.mjs';
import { pagina } from './pagina.mjs';

function leerJson(ruta, requeridos) {
  let datos;
  try {
    datos = JSON.parse(readFileSync(ruta, 'utf8'));
  } catch (e) {
    throw new Error(`${ruta}: no se puede leer (${e.message})`);
  }
  for (const campo of requeridos) {
    if (datos[campo] === undefined || datos[campo] === '') {
      throw new Error(`${ruta}: falta "${campo}"`);
    }
  }
  return datos;
}

const subcarpetas = (ruta) =>
  readdirSync(ruta, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

export function leerUnidades(raizContenido) {
  const unidades = [];
  for (const u of subcarpetas(raizContenido)) {
    const rutaU = join(raizContenido, u);
    const meta = leerJson(join(rutaU, 'unidad.json'), ['titulo', 'orden']);
    const apartados = subcarpetas(rutaU)
      .map((a) => ({
        id: a,
        ruta: join(rutaU, a),
        ...leerJson(join(rutaU, a, 'apartado.json'), ['titulo', 'orden', 'resumen']),
      }))
      .sort((x, y) => x.orden - y.orden);
    unidades.push({ id: u, ruta: rutaU, ...meta, apartados });
  }
  return unidades.sort((x, y) => x.orden - y.orden);
}

export function paginaIndice(unidades) {
  const bloques = unidades
    .map(
      (u) => `<h2>${escapar(u.titulo)}</h2>
<div class="lista">
${u.apartados
  .map(
    (a) => `<div class="tarjeta">
<h3>${escapar(a.titulo)}</h3>
<p class="suave">${escapar(a.resumen)}</p>
<p class="enlaces">${a.enlaces
      .map((e) => `<a class="boton" href="${u.id}/${a.id}/${e.archivo}">${e.candado ? '🔒 ' : ''}${e.texto}</a>`)
      .join(' ')}</p>
</div>`,
  )
  .join('\n')}
</div>`,
    )
    .join('\n');
  return pagina({
    titulo: 'PSP · 2º DAM',
    base: '',
    cuerpo: `<h1>PSP · 2º DAM</h1>
<p class="suave">Programación de servicios y procesos. Materiales de clase.</p>
${bloques}
<h2>Consulta</h2>
<div class="lista"><div class="tarjeta"><h3><a href="glosario/index.html">Glosario</a></h3><p class="suave">Términos de Java usados en las clases</p></div></div>`,
  });
}
