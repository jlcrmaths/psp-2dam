import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { escapar, md } from './md.mjs';

const INCLUIR = /\{\{codigo:\s*([^:@}]+?)(?:\s*::\s*(\d+)-(\d+))?(?:\s*@@\s*([\d|,-]+))?\s*\}\}/g;
const MARCA_HTML = '<!-- html -->';

function buscarArchivo(carpeta, nombre) {
  if (!existsSync(carpeta)) return null;
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) {
      const encontrado = buscarArchivo(ruta, nombre);
      if (encontrado) return encontrado;
    } else if (entrada.name === nombre) {
      return ruta;
    }
  }
  return null;
}

export function incluirCodigo(texto, carpetaProyectos, origen) {
  return texto.replace(INCLUIR, (directiva, ruta, ini, fin, resaltar) => {
    const [proyecto, archivo] = ruta.trim().split('/');
    const encontrado = archivo && buscarArchivo(join(carpetaProyectos, proyecto), archivo);
    if (!encontrado) throw new Error(`${origen}: ${directiva} no existe`);
    let lineas = readFileSync(encontrado, 'utf8')
      .replace(/^package [^;]+;\n+/, '')
      .replace(/\s+$/, '')
      .split('\n');
    if (ini) lineas = lineas.slice(Number(ini) - 1, Number(fin));
    const atributo = resaltar ? ` data-line-numbers="${resaltar}"` : '';
    return `<pre><code class="language-java" data-trim${atributo}>${escapar(lineas.join('\n'))}</code></pre>`;
  });
}

export function dividirDiapositivas(fuente) {
  return fuente
    .replace(/\r\n/g, '\n')
    .split(/\n---\n/)
    .map((bloque) => bloque.split(/\n--\n/).map((s) => s.trim()).filter(Boolean))
    .filter((grupo) => grupo.length);
}

function diapositiva(texto) {
  if (texto.startsWith(MARCA_HTML)) return texto.slice(MARCA_HTML.length).trim();
  return md(texto);
}

export function renderPresentacion(fuente, carpetaProyectos, origen) {
  const grupos = dividirDiapositivas(incluirCodigo(fuente, carpetaProyectos, origen));
  return grupos
    .map((grupo) =>
      grupo.length === 1
        ? `<section>\n${diapositiva(grupo[0])}\n</section>`
        : `<section>\n${grupo.map((s) => `<section>\n${diapositiva(s)}\n</section>`).join('\n')}\n</section>`,
    )
    .join('\n');
}

export function paginaPresentacion({ titulo, secciones, base }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapar(titulo)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/highlight/monokai.css">
<link rel="stylesheet" href="${base}estilo/tema.css">
<link rel="stylesheet" href="${base}estilo/presentacion.css">
<script>try{var t=localStorage.getItem('tema');if(t)document.documentElement.setAttribute('data-tema',t)}catch(e){}</script>
</head>
<body class="presentacion">
<div class="reveal">
<div class="slides">
${secciones}
</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/highlight/highlight.js"></script>
<script>Reveal.initialize({ hash: true, slideNumber: 'c/t', plugins: [ RevealHighlight ] });</script>
</body>
</html>
`;
}
