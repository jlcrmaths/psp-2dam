import { escapar } from './md.mjs';

export function pagina({ titulo, cuerpo, base = '', scripts = [], clase = '' }) {
  const modulos = scripts
    .map((s) => `<script type="module" src="${base}${s}"></script>`)
    .join('\n');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<link rel="stylesheet" href="${base}estilo/tema.css">
<script>document.documentElement.classList.add('js');try{var t=localStorage.getItem('tema');if(t)document.documentElement.setAttribute('data-tema',t)}catch(e){}</script>
</head>
<body class="${clase}">
<header class="cabecera">
  <a class="marca" href="${base}index.html">PSP · 2º DAM</a>
  <nav><a href="${base}glosario/index.html">Glosario</a><button id="tema" type="button" aria-label="Cambiar entre tema claro y oscuro">◐</button></nav>
</header>
<main class="contenido">
${cuerpo}
</main>
<script type="module" src="${base}estilo/tema.js"></script>
${modulos}
</body>
</html>
`;
}
