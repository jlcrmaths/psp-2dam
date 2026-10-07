# Reorganización escalable del material de PSP: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir los HTML escritos a mano por fuentes pequeñas y un generador en Node que produce `docs/` (índice, enunciados con ayudas, presentaciones, glosario y notas cifradas) con un estilo único claro/oscuro.

**Architecture:** `construir.mjs` llama a `lib/construir.mjs`, que recorre `contenido/` (unidades y apartados), `glosario/` (una ficha `.md` por término) y `privado/` (notas, fuera de git). Cada tipo de página tiene su módulo en `lib/` (analiza la fuente y devuelve HTML) y todas comparten `estilo/tema.css`. Las notas se cifran con AES-256-GCM y se descifran en el navegador con WebCrypto.

**Tech Stack:** Node 22 (`node:test`, `node:crypto`, ES modules), `marked` (única dependencia), reveal.js 5 por CDN, HTML y CSS sin framework.

**Spec:** `diseno/2026-10-07-reorganizacion-escalable-design.md`

## Global Constraints

- Node 22; única dependencia npm: `marked`.
- La salida va a `docs/` y se puede borrar y regenerar. Los documentos de diseño van en `diseno/`, nunca en `docs/`.
- Estilo claro = azul limpio (acento `#2563eb`, fondo `#f4f7fb`). Estilo oscuro = editor oscuro (acento `#3ddc97`, fondo `#12171d`). Automático según el sistema, con botón para forzarlo. Tipografía del sistema, sin fuentes descargadas.
- Cada ejercicio del enunciado tiene `### Ayuda ligera`, `### Más ayuda` y `### Paso a paso`. Las ayudas solo usan palabras: sin bloques de código. Sin solución en la página.
- Las ayudas se abren en orden. El estado se guarda en `localStorage` dentro de `try/catch`. Sin JavaScript, todas las ayudas se ven desplegadas.
- Notas del profesor: fuente en `privado/<unidad>/<apartado>/notas-profesor.md` (ignorada por git). Cifradas con AES-256-GCM, clave derivada con PBKDF2-SHA256 de 600000 iteraciones. La frase no se guarda en ningún archivo: llega por la variable de entorno `PSP_FRASE`.
- Código Java de los proyectos: estilo del profesor (un archivo por clase, paquete `crearhilos`, `Runnable`, clase `Principal`, sin comentarios).
- Los commits terminan con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Ampliación de la spec: cada unidad lleva un `unidad.json` (`titulo`, `orden`) para poder titular el índice.

## Review Focus

Entradas que la spec implica y que podrían fallar. Cada una tiene su prueba en la tarea indicada.

- Ejercicio sin una de sus tres ayudas: error claro con el nombre del ejercicio y de la ayuda (Tarea 2).
- Ayuda con bloque de código: error que lo explica (Tarea 2).
- Dos fichas con el mismo término, aunque cambien mayúsculas: error que nombra los dos archivos (Tarea 3).
- `{{codigo: ...}}` a un archivo que no existe: error claro, y código con `<`, `>` y `&` escapado en la diapositiva (Tarea 4).
- Hay notas en `privado/` pero no hay `PSP_FRASE`: error que dice qué variable definir, no una página vacía (Tarea 6).
- Apartado sin `enunciado.md` o sin `presentacion.md`: el índice no enlaza páginas que no existen (Tarea 6).
- Frase incorrecta o vacía al descifrar: no se revela nada (Tarea 5).

---

## File Structure

Se crea:
- `package.json`, `construir.mjs` (CLI de dos líneas)
- `lib/md.mjs`: `md`, `mdLinea`, `escapar`
- `lib/pagina.mjs`: `pagina` (plantilla común)
- `lib/enunciado.mjs`: `analizarEnunciado`, `paginaEnunciado`
- `lib/glosario.mjs`: `analizarFicha`, `reunirFichas`, `paginaGlosario`
- `lib/presentacion.mjs`: `incluirCodigo`, `dividirDiapositivas`, `renderPresentacion`, `paginaPresentacion`
- `lib/notas.mjs`: `cifrar`, `paginaNotas`
- `lib/indice.mjs`: `leerUnidades`, `paginaIndice`
- `lib/construir.mjs`: `construir`
- `estilo/tema.css`, `estilo/presentacion.css`, `estilo/tema.js`, `estilo/ayudas-logica.js`, `estilo/ayudas.js`, `estilo/glosario.js`, `estilo/descifrar.js`, `estilo/acceso.js`
- `tests/*.test.mjs` (uno por módulo de `lib/` y uno de extremo a extremo)
- `contenido/u1/unidad.json`, `contenido/u1/6.1-crear-hilos/{apartado.json,enunciado.md,presentacion.md,proyectos/}`
- `glosario/*.md` (una ficha por término)

Se modifica: `.gitignore`, `.claude/skills/preparar-clase-psp/SKILL.md`, la memoria del proyecto.

Se elimina: `clases/6.1-crear-hilos/{enunciado.*,notas-profesor.*,presentacion.html}`, `glosario/glosario.html`, `index.html` de la raíz.

---

### Task 1: Andamiaje, utilidades y tema visual

**Files:**
- Create: `package.json`, `lib/md.mjs`, `lib/pagina.mjs`, `estilo/tema.css`, `estilo/tema.js`
- Create: `tests/md.test.mjs`, `tests/pagina.test.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `md(texto): string` (Markdown a HTML de bloque), `mdLinea(texto): string` (sin `<p>`), `escapar(texto): string`, `pagina({ titulo, cuerpo, base = '', scripts = [], clase = '' }): string`. `base` es el prefijo relativo hasta la raíz de `docs/` (por ejemplo `'../../'`). `scripts` son rutas relativas a `docs/`, cargadas como módulos.

- [ ] **Step 1: Crear `package.json` e instalar la dependencia**

```bash
cd /Users/clases/PSP
cat > package.json <<'EOF'
{
  "name": "psp-2dam",
  "private": true,
  "type": "module",
  "scripts": {
    "construir": "node construir.mjs",
    "test": "node --test"
  }
}
EOF
npm install marked
```

Expected: se crean `node_modules/` y `package-lock.json`, y `package.json` pasa a incluir `"dependencies": { "marked": ... }`.

- [ ] **Step 2: Actualizar `.gitignore`**

Contenido final de `.gitignore` (sustituye todo el archivo):

```
material-profesor/
privado/
node_modules/
/clases/
**/nbproject/private/
**/build/
**/dist/
.DS_Store
.superpowers/
```

- [ ] **Step 3: Escribir las pruebas que fallan**

`tests/md.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { md, mdLinea, escapar } from '../lib/md.mjs';

test('md convierte negrita y código en línea', () => {
  assert.match(md('**hola** `x`'), /<strong>hola<\/strong> <code>x<\/code>/);
});

test('mdLinea no envuelve en párrafo', () => {
  assert.equal(mdLinea('`run()`'), '<code>run()</code>');
});

test('escapar protege < > & y comillas', () => {
  assert.equal(escapar('a<b && "c"'), 'a&lt;b &amp;&amp; &quot;c&quot;');
});
```

`tests/pagina.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { pagina } from '../lib/pagina.mjs';

test('pagina enlaza el tema con la base relativa y escapa el título', () => {
  const html = pagina({ titulo: 'A & B', cuerpo: '<p>x</p>', base: '../../' });
  assert.match(html, /<title>A &amp; B<\/title>/);
  assert.match(html, /href="\.\.\/\.\.\/estilo\/tema\.css"/);
  assert.match(html, /href="\.\.\/\.\.\/index\.html"/);
  assert.match(html, /<p>x<\/p>/);
});

test('pagina carga los scripts pedidos como módulos', () => {
  const html = pagina({ titulo: 'T', cuerpo: '', base: '../', scripts: ['estilo/ayudas.js'] });
  assert.match(html, /<script type="module" src="\.\.\/estilo\/ayudas\.js"><\/script>/);
});

test('pagina marca la clase js y recuerda el tema guardado', () => {
  const html = pagina({ titulo: 'T', cuerpo: '' });
  assert.match(html, /classList\.add\('js'\)/);
  assert.match(html, /localStorage\.getItem\('tema'\)/);
});
```

- [ ] **Step 4: Comprobar que fallan**

Run: `node --test tests/md.test.mjs tests/pagina.test.mjs`
Expected: FAIL con `Cannot find module '../lib/md.mjs'`.

- [ ] **Step 5: Implementar `lib/md.mjs` y `lib/pagina.mjs`**

`lib/md.mjs`:

```js
import { marked } from 'marked';

export function md(texto) {
  return marked.parse(texto, { async: false, gfm: true });
}

export function mdLinea(texto) {
  return marked.parseInline(texto, { async: false });
}

export function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

`lib/pagina.mjs`:

```js
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
```

- [ ] **Step 6: Escribir `estilo/tema.css` y `estilo/tema.js`**

`estilo/tema.css`:

```css
:root {
  --fondo: #f4f7fb;
  --tarjeta: #ffffff;
  --texto: #1b2a3a;
  --suave: #5a6b7d;
  --acento: #2563eb;
  --acento-texto: #ffffff;
  --borde: #c9d6ea;
  --codigo-fondo: #0f172a;
  --codigo-texto: #e2e8f0;
  --en-linea: #e8eef7;
  --caja-fondo: #eef4ff;
  --aviso-fondo: #fff4e5;
  --aviso-borde: #f59e0b;
  --radio: 10px;
  --fuente: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) {
    --fondo: #12171d; --tarjeta: #1c242d; --texto: #e6edf3; --suave: #9aa7b4;
    --acento: #3ddc97; --acento-texto: #06281a; --borde: #2f3b47;
    --codigo-fondo: #0a0e12; --codigo-texto: #d5f5e6; --en-linea: #232d38;
    --caja-fondo: #16281f; --aviso-fondo: #2a2112; --aviso-borde: #f59e0b;
  }
}
:root[data-tema="oscuro"] {
  --fondo: #12171d; --tarjeta: #1c242d; --texto: #e6edf3; --suave: #9aa7b4;
  --acento: #3ddc97; --acento-texto: #06281a; --borde: #2f3b47;
  --codigo-fondo: #0a0e12; --codigo-texto: #d5f5e6; --en-linea: #232d38;
  --caja-fondo: #16281f; --aviso-fondo: #2a2112; --aviso-borde: #f59e0b;
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--fondo); color: var(--texto); font: 17px/1.65 var(--fuente); }
a { color: var(--acento); }
h1 { font-size: 2rem; line-height: 1.25; margin: 0 0 1rem; padding-bottom: .5rem; border-bottom: 4px solid var(--acento); }
h2 { font-size: 1.35rem; margin: 2rem 0 .6rem; color: var(--acento); }
h3 { font-size: 1.1rem; margin: 1rem 0 .4rem; }
p { margin: .7rem 0; }
ul, ol { padding-left: 1.4rem; }
li { margin: .35rem 0; }
.suave { color: var(--suave); }

.cabecera { display: flex; justify-content: space-between; align-items: center; max-width: 900px; margin: 0 auto; padding: 14px 16px 0; }
.cabecera nav { display: flex; gap: 14px; align-items: center; }
.marca { font-weight: 700; text-decoration: none; letter-spacing: .04em; }
#tema { background: var(--tarjeta); color: var(--texto); border: 1px solid var(--borde); border-radius: 8px; padding: 4px 10px; font-size: 1rem; cursor: pointer; }
.contenido { max-width: 900px; margin: 0 auto; padding: 8px 16px 48px; }

.tarjeta { background: var(--tarjeta); border: 1px solid var(--borde); border-radius: var(--radio); padding: 18px 22px; margin: 16px 0; }
.tarjeta > h2:first-child, .tarjeta > h3:first-child { margin-top: 0; }
.lista { display: grid; gap: 12px; }
.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 16px; }
.enlaces { display: flex; flex-wrap: wrap; gap: 8px; }

code { font: .9em var(--mono); background: var(--en-linea); padding: .1em .38em; border-radius: 5px; }
pre { background: var(--codigo-fondo); color: var(--codigo-texto); padding: 14px 18px; border-radius: var(--radio); overflow-x: auto; line-height: 1.5; }
pre code { background: none; padding: 0; color: inherit; }

.boton, button.boton, .ayuda-botones button { display: inline-block; background: var(--tarjeta); color: var(--texto); border: 1px solid var(--borde); border-radius: 8px; padding: 6px 12px; font: inherit; font-size: .92rem; text-decoration: none; cursor: pointer; }
.boton:hover, .ayuda-botones button:hover:not(:disabled) { border-color: var(--acento); }
.ayuda-botones { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 8px; }
.ayuda-botones button.activo { background: var(--acento); color: var(--acento-texto); border-color: var(--acento); }
.ayuda-botones button:disabled { opacity: .45; cursor: not-allowed; }
.ayuda { background: var(--caja-fondo); border-left: 5px solid var(--acento); border-radius: 6px; padding: 8px 16px; margin: 10px 0; }
.ayuda h3 { margin-top: .4rem; }
.js .ayuda { display: none; }
.js .ayuda.abierta { display: block; }

.caja { background: var(--caja-fondo); border-left: 6px solid var(--acento); padding: .4em .9em; border-radius: 6px; }
.aviso { background: var(--aviso-fondo); border-left: 6px solid var(--aviso-borde); padding: .4em .9em; border-radius: 6px; }
.salida { background: #0a0e12; color: #9fe870; padding: .6em 1em; border-radius: 8px; font-family: var(--mono); line-height: 1.5; }

.ficha h2 { margin: 0 0 .5rem; font-size: 1.15rem; }
.ficha h2 code { background: none; padding: 0; font-size: 1em; }
.ficha dl { margin: 0; }
.ficha dt { font-size: .78rem; text-transform: uppercase; letter-spacing: .05em; color: var(--suave); margin-top: .7rem; }
.ficha dd { margin: .15rem 0 0; }
.ficha dd p { margin: .2rem 0; }
.ficha pre { margin: .2rem 0 0; }
#buscar, .acceso input { width: 100%; padding: 10px 14px; font: inherit; color: var(--texto); background: var(--tarjeta); border: 1px solid var(--borde); border-radius: var(--radio); margin: 8px 0; }
.acceso label { display: block; margin-bottom: 8px; }
.notas { margin-top: 16px; }

@media (max-width: 520px) {
  .rejilla { grid-template-columns: 1fr; }
  .tarjeta { padding: 14px 14px; }
}
```

`estilo/tema.js`:

```js
const boton = document.getElementById('tema');

function actual() {
  const forzado = document.documentElement.getAttribute('data-tema');
  if (forzado) return forzado;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

if (boton) {
  boton.addEventListener('click', () => {
    const nuevo = actual() === 'oscuro' ? 'claro' : 'oscuro';
    document.documentElement.setAttribute('data-tema', nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) {}
  });
}
```

- [ ] **Step 7: Comprobar que pasan**

Run: `node --test tests/md.test.mjs tests/pagina.test.mjs`
Expected: 6 pruebas pasan.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore lib/md.mjs lib/pagina.mjs estilo/tema.css estilo/tema.js tests/md.test.mjs tests/pagina.test.mjs
git commit -m "Añade andamiaje del generador, plantilla común y tema claro/oscuro"
```

---

### Task 2: Enunciados con ayudas por fases

**Files:**
- Create: `lib/enunciado.mjs`, `estilo/ayudas-logica.js`, `estilo/ayudas.js`
- Test: `tests/enunciado.test.mjs`, `tests/ayudas-logica.test.mjs`

**Interfaces:**
- Consumes: `md`, `mdLinea` de `lib/md.mjs`; `pagina` de `lib/pagina.mjs`.
- Produces: `analizarEnunciado(fuente: string, origen?: string): { titulo, intro, ejercicios: [{ titulo, texto, ayudas: { ligera, mas, paso } }], extras: [{ titulo, texto }] }`. Lanza `Error` si falta una ayuda, si una ayuda lleva código o si no hay ejercicios. `paginaEnunciado(datos, base): string`. En el navegador: `alternar(abiertas: Set<number>, i, total): Set<number>` y `puedeAbrir(abiertas, i): boolean`.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/enunciado.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { analizarEnunciado, paginaEnunciado } from '../lib/enunciado.mjs';

const CERCA = '`'.repeat(3);

const BUENO = `# Apartado X

Texto de intro.

## Ejercicio 1: algo

Haz algo con \`Thread\`.

### Ayuda ligera
Piensa en una clase.

### Más ayuda
Usa \`Runnable\`.

### Paso a paso
1. Crea la clase.
2. Lanza el hilo.

## Ejercicio 2: otra cosa

Segundo ejercicio.

### Ayuda ligera
Una pista.

### Más ayuda
Otra pista.

### Paso a paso
1. Un paso.

## Preguntas

1. ¿Por qué?
`;

test('analizarEnunciado separa título, ejercicios, ayudas y extras', () => {
  const d = analizarEnunciado(BUENO);
  assert.equal(d.titulo, 'Apartado X');
  assert.equal(d.intro, 'Texto de intro.');
  assert.equal(d.ejercicios.length, 2);
  assert.equal(d.ejercicios[0].titulo, 'Ejercicio 1: algo');
  assert.equal(d.ejercicios[0].texto, 'Haz algo con `Thread`.');
  assert.equal(d.ejercicios[0].ayudas.ligera, 'Piensa en una clase.');
  assert.match(d.ejercicios[0].ayudas.paso, /^1\. Crea la clase\./);
  assert.equal(d.extras[0].titulo, 'Preguntas');
});

test('falta una ayuda: el error nombra el ejercicio y la ayuda', () => {
  const roto = BUENO.replace('### Más ayuda\nUsa `Runnable`.\n\n', '');
  assert.throws(() => analizarEnunciado(roto, 'e.md'), /e\.md: el ejercicio "Ejercicio 1: algo" no tiene "Más ayuda"/);
});

test('una ayuda con bloque de código es un error', () => {
  const roto = BUENO.replace('Piensa en una clase.', `${CERCA}java\nint x;\n${CERCA}`);
  assert.throws(() => analizarEnunciado(roto), /Ayuda ligera.*lleva código/);
});

test('sin ejercicios es un error', () => {
  assert.throws(() => analizarEnunciado('# Solo título\n\ntexto'), /no hay ningún ejercicio/);
});

test('paginaEnunciado pinta tres ayudas y tres botones por ejercicio', () => {
  const html = paginaEnunciado(analizarEnunciado(BUENO), '../../');
  assert.equal(html.match(/class="ayuda"/g).length, 6);
  assert.equal(html.match(/<button type="button" data-nivel=/g).length, 6);
  assert.match(html, /data-ejercicio="ej-1"/);
  assert.match(html, /data-ejercicio="ej-2"/);
  assert.match(html, /<h2>Preguntas<\/h2>/);
  assert.match(html, /estilo\/ayudas\.js/);
});
```

`tests/ayudas-logica.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { alternar, puedeAbrir } from '../estilo/ayudas-logica.js';

test('solo se puede abrir la primera ayuda al empezar', () => {
  assert.equal(puedeAbrir(new Set(), 0), true);
  assert.equal(puedeAbrir(new Set(), 1), false);
  assert.equal(puedeAbrir(new Set([0]), 1), true);
});

test('alternar no abre una ayuda si falta la anterior', () => {
  assert.deepEqual([...alternar(new Set(), 2, 3)], []);
});

test('alternar abre en orden', () => {
  let a = alternar(new Set(), 0, 3);
  a = alternar(a, 1, 3);
  assert.deepEqual([...a], [0, 1]);
});

test('cerrar una ayuda cierra también las siguientes', () => {
  const a = alternar(new Set([0, 1, 2]), 1, 3);
  assert.deepEqual([...a], [0]);
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `node --test tests/enunciado.test.mjs tests/ayudas-logica.test.mjs`
Expected: FAIL con `Cannot find module`.

- [ ] **Step 3: Implementar `lib/enunciado.mjs`**

```js
import { md, mdLinea } from './md.mjs';
import { pagina } from './pagina.mjs';

const NIVELES = [
  ['ligera', 'Ayuda ligera'],
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
```

- [ ] **Step 4: Implementar los scripts del navegador**

`estilo/ayudas-logica.js`:

```js
export function puedeAbrir(abiertas, i) {
  return i === 0 || abiertas.has(i - 1);
}

export function alternar(abiertas, i, total) {
  const nuevo = new Set(abiertas);
  if (nuevo.has(i)) {
    for (let j = i; j < total; j++) nuevo.delete(j);
  } else if (puedeAbrir(nuevo, i)) {
    nuevo.add(i);
  }
  return nuevo;
}
```

`estilo/ayudas.js`:

```js
import { alternar, puedeAbrir } from './ayudas-logica.js';

const CLAVE = 'ayudas:' + location.pathname;
let guardado = {};
try { guardado = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) {}

function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(guardado)); } catch (e) {}
}

for (const ejercicio of document.querySelectorAll('[data-ejercicio]')) {
  const id = ejercicio.dataset.ejercicio;
  const contenedor = ejercicio.querySelector('.ayuda-botones');
  const botones = [...contenedor.querySelectorAll('button')];
  const ayudas = [...ejercicio.querySelectorAll('.ayuda')];
  let abiertas = new Set(guardado[id] || []);
  contenedor.hidden = false;

  function pintar() {
    ayudas.forEach((a, i) => a.classList.toggle('abierta', abiertas.has(i)));
    botones.forEach((b, i) => {
      b.disabled = !puedeAbrir(abiertas, i) && !abiertas.has(i);
      b.setAttribute('aria-expanded', String(abiertas.has(i)));
      b.classList.toggle('activo', abiertas.has(i));
    });
  }

  botones.forEach((b, i) => {
    b.addEventListener('click', () => {
      abiertas = alternar(abiertas, i, ayudas.length);
      guardado[id] = [...abiertas];
      guardar();
      pintar();
    });
  });
  pintar();
}
```

- [ ] **Step 5: Comprobar que pasan**

Run: `node --test tests/enunciado.test.mjs tests/ayudas-logica.test.mjs`
Expected: 9 pruebas pasan.

- [ ] **Step 6: Commit**

```bash
git add lib/enunciado.mjs estilo/ayudas-logica.js estilo/ayudas.js tests/enunciado.test.mjs tests/ayudas-logica.test.mjs
git commit -m "Añade enunciados con tres ayudas por fases"
```

---

### Task 3: Glosario con una ficha por término

**Files:**
- Create: `lib/glosario.mjs`, `estilo/glosario.js`
- Test: `tests/glosario.test.mjs`

**Interfaces:**
- Consumes: `md`, `escapar`; `pagina`.
- Produces: `analizarFicha(fuente, origen): { nombre, que, para, ejemplo, origen }`; `reunirFichas(fichas): ficha[]` (ordenadas, lanza `Error` si hay términos duplicados); `paginaGlosario(fichas, base): string`.

Formato de una ficha (`glosario/<slug>.md`):

````
---
nombre: array
---

## Qué es

Fila de cajas numeradas.

## Para qué sirve

Guardar varios valores.

## Ejemplo mínimo

```java
int[] numeros = {1, 2, 3};
```
````

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/glosario.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { analizarFicha, reunirFichas, paginaGlosario } from '../lib/glosario.mjs';

const CERCA = '`'.repeat(3);

function ficha(nombre, extra = '') {
  return `---
nombre: ${nombre}
---

## Qué es

Algo ${extra}.

## Para qué sirve

Para algo.

## Ejemplo mínimo

${CERCA}java
int x = 1 < 2 ? 1 : 0;
${CERCA}
`;
}

test('analizarFicha lee nombre y los tres campos', () => {
  const f = analizarFicha(ficha('array'), 'array.md');
  assert.equal(f.nombre, 'array');
  assert.equal(f.que, 'Algo .');
  assert.equal(f.para, 'Para algo.');
  assert.match(f.ejemplo, /int x = 1 < 2/);
});

test('analizarFicha acepta nombres con comillas y @', () => {
  assert.equal(analizarFicha(ficha('@Override'), 'o.md').nombre, '@Override');
  assert.equal(analizarFicha(ficha('new Thread(objeto, "nombre")'), 't.md').nombre, 'new Thread(objeto, "nombre")');
});

test('analizarFicha sin cabecera o sin un campo es un error claro', () => {
  assert.throws(() => analizarFicha('## Qué es\nx', 'a.md'), /a\.md: falta la cabecera/);
  const sinPara = ficha('x').replace('## Para qué sirve\n\nPara algo.\n\n', '');
  assert.throws(() => analizarFicha(sinPara, 'b.md'), /b\.md: falta "Para qué sirve"/);
});

test('reunirFichas ordena sin contar @ ni . iniciales', () => {
  const lista = ['Thread', '@Override', 'array', '.length'].map((n) => analizarFicha(ficha(n), `${n}.md`));
  assert.deepEqual(reunirFichas(lista).map((f) => f.nombre), ['array', '.length', '@Override', 'Thread']);
});

test('reunirFichas rechaza duplicados aunque cambien las mayúsculas y nombra los dos archivos', () => {
  const lista = [analizarFicha(ficha('Thread'), 'a.md'), analizarFicha(ficha('thread'), 'b.md')];
  assert.throws(() => reunirFichas(lista), /término duplicado "thread": a\.md y b\.md/);
});

test('paginaGlosario escapa el nombre y el código de ejemplo', () => {
  const f = analizarFicha(ficha('new Thread(objeto, "nombre")'), 't.md');
  const html = paginaGlosario([f], '../');
  assert.match(html, /data-nombre="new Thread\(objeto, &quot;nombre&quot;\)"/);
  assert.match(html, /int x = 1 &lt; 2/);
  assert.match(html, /estilo\/glosario\.js/);
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `node --test tests/glosario.test.mjs`
Expected: FAIL con `Cannot find module '../lib/glosario.mjs'`.

- [ ] **Step 3: Implementar `lib/glosario.mjs`**

```js
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
```

- [ ] **Step 4: Escribir `estilo/glosario.js`**

```js
const buscar = document.getElementById('buscar');
const fichas = document.querySelectorAll('.ficha');
const vacio = document.getElementById('vacio');

buscar.addEventListener('input', () => {
  const q = buscar.value.toLowerCase();
  let visibles = 0;
  fichas.forEach((f) => {
    const coincide = f.textContent.toLowerCase().includes(q);
    f.hidden = !coincide;
    if (coincide) visibles++;
  });
  vacio.hidden = visibles > 0;
});
```

Añadir a `estilo/tema.css` (al final) para que `hidden` gane a `display: grid` de las fichas:

```css
[hidden] { display: none !important; }
```

- [ ] **Step 5: Comprobar que pasan**

Run: `node --test tests/glosario.test.mjs`
Expected: 6 pruebas pasan.

- [ ] **Step 6: Commit**

```bash
git add lib/glosario.mjs estilo/glosario.js estilo/tema.css tests/glosario.test.mjs
git commit -m "Añade glosario generado desde una ficha por término"
```

---

### Task 4: Presentaciones con código incluido desde los proyectos

**Files:**
- Create: `lib/presentacion.mjs`, `estilo/presentacion.css`
- Test: `tests/presentacion.test.mjs`

**Interfaces:**
- Consumes: `md`, `escapar`.
- Produces: `incluirCodigo(texto, carpetaProyectos, origen): string`, `dividirDiapositivas(fuente): string[][]`, `renderPresentacion(fuente, carpetaProyectos, origen): string` (secciones reveal.js), `paginaPresentacion({ titulo, secciones, base }): string`.

Sintaxis de `presentacion.md`:
- `---` en línea propia separa diapositivas; `--` separa subdiapositivas verticales.
- `{{codigo: Proyecto/Archivo.java}}` incluye el archivo real (sin la línea `package`). Opcional: `:: 5-12` para un rango de líneas y `@@ 1|3-4` para resaltar líneas paso a paso.
- Una diapositiva cuya primera línea es `<!-- html -->` se inserta tal cual, sin pasar por Markdown.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/presentacion.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  incluirCodigo, dividirDiapositivas, renderPresentacion, paginaPresentacion,
} from '../lib/presentacion.mjs';

function proyectos() {
  const dir = mkdtempSync(join(tmpdir(), 'psp-pres-'));
  const src = join(dir, 'Ejemplo', 'src', 'crearhilos');
  mkdirSync(src, { recursive: true });
  writeFileSync(join(src, 'Cuenta.java'),
    'package crearhilos;\n\npublic class Cuenta {\n    int a = 1 < 2 ? 1 : 0;\n    String s = "x" + 1 & 2;\n}\n');
  return dir;
}

test('dividirDiapositivas separa horizontales y verticales', () => {
  assert.deepEqual(dividirDiapositivas('a\n---\nb\n--\nc'), [['a'], ['b', 'c']]);
});

test('incluirCodigo copia el archivo real, sin package y con < > & escapados', () => {
  const html = incluirCodigo('{{codigo: Ejemplo/Cuenta.java}}', proyectos(), 'p.md');
  assert.match(html, /<pre><code class="language-java" data-trim>/);
  assert.match(html, /public class Cuenta/);
  assert.match(html, /1 &lt; 2/);
  assert.match(html, /&amp; 2/);
  assert.doesNotMatch(html, /package crearhilos/);
});

test('incluirCodigo admite rango de líneas y resaltado', () => {
  const html = incluirCodigo('{{codigo: Ejemplo/Cuenta.java :: 2-3 @@ 1|2}}', proyectos(), 'p.md');
  assert.match(html, /data-line-numbers="1\|2"/);
  assert.match(html, /int a = 1/);
  assert.doesNotMatch(html, /public class Cuenta/);
});

test('incluirCodigo con un archivo inexistente da un error claro', () => {
  assert.throws(
    () => incluirCodigo('{{codigo: Ejemplo/NoExiste.java}}', proyectos(), 'p.md'),
    /p\.md: \{\{codigo: Ejemplo\/NoExiste\.java\}\} no existe/,
  );
});

test('renderPresentacion pasa Markdown por marked y deja intacto el HTML marcado', () => {
  const fuente = 'Hola **mundo**\n---\n<!-- html -->\n<h3>x</h3>\n\n<p>*a*</p>\n--\n# Vertical';
  const html = renderPresentacion(fuente, proyectos(), 'p.md');
  assert.match(html, /<strong>mundo<\/strong>/);
  assert.match(html, /<p>\*a\*<\/p>/);
  assert.match(html, /<section>\s*<section>/);
});

test('paginaPresentacion carga reveal.js y el tema', () => {
  const html = paginaPresentacion({ titulo: 'T & U', secciones: '<section>x</section>', base: '../../' });
  assert.match(html, /<title>T &amp; U<\/title>/);
  assert.match(html, /reveal\.js@5\/dist\/reveal\.js/);
  assert.match(html, /href="\.\.\/\.\.\/estilo\/presentacion\.css"/);
  assert.match(html, /<section>x<\/section>/);
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `node --test tests/presentacion.test.mjs`
Expected: FAIL con `Cannot find module '../lib/presentacion.mjs'`.

- [ ] **Step 3: Implementar `lib/presentacion.mjs`**

```js
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
```

- [ ] **Step 4: Escribir `estilo/presentacion.css`**

```css
body.presentacion { background: var(--fondo); }
.reveal { font-family: var(--fuente); color: var(--texto); font-size: 32px; }
.reveal h1, .reveal h2, .reveal h3 { color: var(--acento); font-family: var(--fuente); text-transform: none; font-weight: 700; letter-spacing: 0; }
.reveal a { color: var(--acento); }
.reveal ul, .reveal ol { display: block; }
.reveal li { margin-bottom: .35em; }
.reveal code { font-family: var(--mono); }
.reveal :not(pre) > code { background: var(--en-linea); color: var(--texto); padding: .05em .3em; border-radius: 5px; }
.reveal pre { box-shadow: none; width: 100%; }
.reveal pre code { max-height: 520px; font-size: .78em; border-radius: var(--radio); }
.reveal pre code.hljs { background: var(--codigo-fondo); }
.reveal .peque { font-size: .8em; }
.reveal .salida { background: #0a0e12; color: #9fe870; padding: .6em 1em; border-radius: 8px; font-family: var(--mono); font-size: .8em; text-align: left; line-height: 1.5; }
.reveal .caja { background: var(--caja-fondo); border-left: 6px solid var(--acento); padding: .4em .9em; text-align: left; font-size: .85em; border-radius: 6px; }
.reveal .aviso { background: var(--aviso-fondo); border-left: 6px solid var(--aviso-borde); padding: .4em .9em; text-align: left; font-size: .85em; border-radius: 6px; }
.reveal .slide-number { color: var(--suave); background: transparent; }
```

- [ ] **Step 5: Comprobar que pasan**

Run: `node --test tests/presentacion.test.mjs`
Expected: 6 pruebas pasan.

- [ ] **Step 6: Commit**

```bash
git add lib/presentacion.mjs estilo/presentacion.css tests/presentacion.test.mjs
git commit -m "Añade presentaciones con código incluido desde los proyectos"
```

---

### Task 5: Notas cifradas

**Files:**
- Create: `lib/notas.mjs`, `estilo/descifrar.js`, `estilo/acceso.js`
- Test: `tests/notas.test.mjs`

**Interfaces:**
- Consumes: `escapar`; `pagina`.
- Produces: `cifrar(texto, frase, iteraciones = ITERACIONES): { v, it, sal, iv, datos }` (base64; `datos` es texto cifrado + etiqueta GCM), `ITERACIONES = 600000`, `paginaNotas({ titulo, paquete, base }): string`. En el navegador y en Node: `descifrar(paquete, frase): Promise<string>`, que lanza error si la frase es incorrecta.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/notas.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { cifrar, paginaNotas, ITERACIONES } from '../lib/notas.mjs';
import { descifrar } from '../estilo/descifrar.js';

const TEXTO = '<h1>Secreto</h1><p>Respuesta del ejercicio 3</p>';

test('se descifra con la frase correcta', async () => {
  const paquete = cifrar(TEXTO, 'cuatro palabras de prueba', 1000);
  assert.equal(await descifrar(paquete, 'cuatro palabras de prueba'), TEXTO);
});

test('una frase incorrecta o vacía no revela nada', async () => {
  const paquete = cifrar(TEXTO, 'frase buena', 1000);
  await assert.rejects(() => descifrar(paquete, 'frase mala'));
  await assert.rejects(() => descifrar(paquete, ''));
});

test('el paquete no contiene el texto en claro y cada cifrado es distinto', () => {
  const a = cifrar(TEXTO, 'f', 1000);
  const b = cifrar(TEXTO, 'f', 1000);
  assert.doesNotMatch(JSON.stringify(a), /Secreto|Respuesta/);
  assert.notEqual(a.datos, b.datos);
  assert.equal(a.v, 1);
});

test('por defecto usa 600000 iteraciones', () => {
  assert.equal(ITERACIONES, 600000);
});

test('la página de notas lleva el formulario y el paquete, sin el texto en claro', () => {
  const html = paginaNotas({ titulo: '6.1 <Hilos>', paquete: cifrar(TEXTO, 'f', 1000), base: '../../' });
  assert.match(html, /id="acceso"/);
  assert.match(html, /<script type="application\/json" id="paquete">\{/);
  assert.match(html, /estilo\/acceso\.js/);
  assert.match(html, /6\.1 &lt;Hilos&gt;/);
  assert.doesNotMatch(html, /Respuesta del ejercicio/);
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `node --test tests/notas.test.mjs`
Expected: FAIL con `Cannot find module '../lib/notas.mjs'`.

- [ ] **Step 3: Implementar `lib/notas.mjs`**

```js
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { escapar } from './md.mjs';
import { pagina } from './pagina.mjs';

export const ITERACIONES = 600000;

export function cifrar(texto, frase, iteraciones = ITERACIONES) {
  const sal = randomBytes(16);
  const iv = randomBytes(12);
  const clave = pbkdf2Sync(frase, sal, iteraciones, 32, 'sha256');
  const cifrador = createCipheriv('aes-256-gcm', clave, iv);
  const cifrado = Buffer.concat([cifrador.update(texto, 'utf8'), cifrador.final()]);
  const etiqueta = cifrador.getAuthTag();
  return {
    v: 1,
    it: iteraciones,
    sal: sal.toString('base64'),
    iv: iv.toString('base64'),
    datos: Buffer.concat([cifrado, etiqueta]).toString('base64'),
  };
}

export function paginaNotas({ titulo, paquete, base }) {
  return pagina({
    titulo: `Notas del profesor · ${titulo}`,
    base,
    scripts: ['estilo/acceso.js'],
    cuerpo: `<h1>Notas del profesor</h1>
<p class="suave">${escapar(titulo)}</p>
<form id="acceso" class="tarjeta acceso">
<label>Código de acceso<input name="frase" type="password" autocomplete="off" required></label>
<button class="boton" type="submit">Entrar</button>
</form>
<p id="error" class="aviso" hidden>Código incorrecto.</p>
<div id="notas" class="notas"></div>
<script type="application/json" id="paquete">${JSON.stringify(paquete)}</script>`,
  });
}
```

- [ ] **Step 4: Implementar el lado del navegador**

`estilo/descifrar.js`:

```js
function deBase64(texto) {
  return Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));
}

export async function descifrar(paquete, frase) {
  const material = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(frase), 'PBKDF2', false, ['deriveKey'],
  );
  const clave = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: deBase64(paquete.sal), iterations: paquete.it, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
  const plano = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: deBase64(paquete.iv) }, clave, deBase64(paquete.datos),
  );
  return new TextDecoder().decode(plano);
}
```

`estilo/acceso.js`:

```js
import { descifrar } from './descifrar.js';

const paquete = JSON.parse(document.getElementById('paquete').textContent);
const formulario = document.getElementById('acceso');
const error = document.getElementById('error');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  error.hidden = true;
  try {
    const html = await descifrar(paquete, formulario.elements.frase.value);
    document.getElementById('notas').innerHTML = html;
    formulario.hidden = true;
  } catch (e) {
    error.hidden = false;
  }
});
```

- [ ] **Step 5: Comprobar que pasan**

Run: `node --test tests/notas.test.mjs`
Expected: 5 pruebas pasan.

- [ ] **Step 6: Commit**

```bash
git add lib/notas.mjs estilo/descifrar.js estilo/acceso.js tests/notas.test.mjs
git commit -m "Añade notas del profesor cifradas con AES-256-GCM"
```

---

### Task 6: Índice, orquestador y prueba de extremo a extremo

**Files:**
- Create: `lib/indice.mjs`, `lib/construir.mjs`, `construir.mjs`
- Test: `tests/indice.test.mjs`, `tests/construir.test.mjs`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: `leerUnidades(raizContenido): unidad[]` con `{ id, ruta, titulo, orden, apartados: [{ id, ruta, titulo, orden, resumen, enlaces? }] }` (lanza `Error` si falta un JSON o un campo); `paginaIndice(unidades): string` (cada apartado debe traer `enlaces: [{ texto, archivo, candado? }]`); `construir({ raiz, frase }): { unidades, apartados, terminos }`.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/indice.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { leerUnidades, paginaIndice } from '../lib/indice.mjs';

function arbol() {
  const raiz = mkdtempSync(join(tmpdir(), 'psp-ind-'));
  const escribir = (ruta, obj) => {
    mkdirSync(join(raiz, ...ruta.slice(0, -1)), { recursive: true });
    writeFileSync(join(raiz, ...ruta), JSON.stringify(obj));
  };
  escribir(['u2', 'unidad.json'], { titulo: 'Unidad 2', orden: 2 });
  escribir(['u1', 'unidad.json'], { titulo: 'Unidad 1', orden: 1 });
  escribir(['u1', '6.2-b', 'apartado.json'], { titulo: 'B', orden: 2, resumen: 'rb' });
  escribir(['u1', '6.1-a', 'apartado.json'], { titulo: 'A', orden: 1, resumen: 'ra' });
  return raiz;
}

test('leerUnidades ordena unidades y apartados por "orden"', () => {
  const u = leerUnidades(arbol());
  assert.deepEqual(u.map((x) => x.id), ['u1', 'u2']);
  assert.deepEqual(u[0].apartados.map((a) => a.id), ['6.1-a', '6.2-b']);
});

test('leerUnidades da un error claro si falta un campo', () => {
  const raiz = arbol();
  writeFileSync(join(raiz, 'u1', '6.1-a', 'apartado.json'), JSON.stringify({ titulo: 'A', orden: 1 }));
  assert.throws(() => leerUnidades(raiz), /apartado\.json: falta "resumen"/);
});

test('paginaIndice enlaza solo lo que existe y marca las notas con candado', () => {
  const u = leerUnidades(arbol());
  u[0].apartados[0].enlaces = [
    { texto: 'Enunciado', archivo: 'enunciado.html' },
    { texto: 'Notas', archivo: 'notas-profesor.html', candado: true },
  ];
  u[0].apartados[1].enlaces = [];
  const html = paginaIndice(u);
  assert.match(html, /href="u1\/6\.1-a\/enunciado\.html"/);
  assert.match(html, /🔒 Notas/);
  assert.doesNotMatch(html, /6\.2-b\/enunciado\.html/);
  assert.match(html, /href="glosario\/index\.html"/);
});
```

`tests/construir.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { construir } from '../lib/construir.mjs';

const CERCA = '`'.repeat(3);
const proyecto = new URL('..', import.meta.url).pathname;

function escribir(raiz, ruta, texto) {
  const archivo = join(raiz, ...ruta);
  mkdirSync(join(archivo, '..'), { recursive: true });
  writeFileSync(archivo, texto);
}

function repo({ conNotas = true, conEnunciado = true } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), 'psp-e2e-'));
  cpSync(join(proyecto, 'estilo'), join(raiz, 'estilo'), { recursive: true });
  const a = ['contenido', 'u1', '6.1-x'];
  escribir(raiz, ['contenido', 'u1', 'unidad.json'], '{"titulo":"Unidad 1","orden":1}');
  escribir(raiz, [...a, 'apartado.json'], '{"titulo":"6.1 X","orden":1,"resumen":"resumen"}');
  if (conEnunciado) {
    escribir(raiz, [...a, 'enunciado.md'],
      '# X\n\n## Ejercicio 1: uno\n\ntexto\n\n### Ayuda ligera\na\n\n### Más ayuda\nb\n\n### Paso a paso\n1. c\n');
  }
  escribir(raiz, [...a, 'presentacion.md'], '# Hola\n---\n{{codigo: P/A.java}}\n');
  escribir(raiz, [...a, 'proyectos', 'P', 'src', 'x', 'A.java'],
    'package x;\n\npublic class A { boolean b = 1 < 2; }\n');
  escribir(raiz, ['glosario', 'array.md'],
    `---\nnombre: array\n---\n\n## Qué es\n\nFila.\n\n## Para qué sirve\n\nGuardar.\n\n## Ejemplo mínimo\n\n${CERCA}java\nint[] a;\n${CERCA}\n`);
  if (conNotas) escribir(raiz, ['privado', 'u1', '6.1-x', 'notas-profesor.md'], '# Nota\n\nTEXTOSECRETO\n');
  return raiz;
}

const leer = (raiz, ...ruta) => readFileSync(join(raiz, 'docs', ...ruta), 'utf8');

test('construye todas las páginas y cifra las notas', () => {
  const raiz = repo();
  const r = construir({ raiz, frase: 'frase de prueba larga' });
  assert.deepEqual(r, { unidades: 1, apartados: 1, terminos: 1 });
  for (const f of ['index.html', '.nojekyll', 'glosario/index.html', 'estilo/tema.css',
    'u1/6.1-x/enunciado.html', 'u1/6.1-x/presentacion.html', 'u1/6.1-x/notas-profesor.html']) {
    assert.ok(existsSync(join(raiz, 'docs', f)), `falta docs/${f}`);
  }
  assert.doesNotMatch(leer(raiz, 'u1', '6.1-x', 'notas-profesor.html'), /TEXTOSECRETO/);
  assert.match(leer(raiz, 'u1', '6.1-x', 'presentacion.html'), /boolean b = 1 &lt; 2/);
  assert.match(leer(raiz, 'index.html'), /🔒 Notas/);
});

test('hay notas pero no hay PSP_FRASE: error que dice qué definir', () => {
  assert.throws(() => construir({ raiz: repo(), frase: undefined }), /PSP_FRASE/);
});

test('sin enunciado el índice no enlaza una página inexistente', () => {
  const raiz = repo({ conEnunciado: false });
  construir({ raiz, frase: 'frase de prueba larga' });
  assert.doesNotMatch(leer(raiz, 'index.html'), /enunciado\.html/);
  assert.equal(existsSync(join(raiz, 'docs', 'u1', '6.1-x', 'enunciado.html')), false);
});

test('sin notas no hace falta frase', () => {
  const raiz = repo({ conNotas: false });
  assert.doesNotThrow(() => construir({ raiz, frase: undefined }));
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `node --test tests/indice.test.mjs tests/construir.test.mjs`
Expected: FAIL con `Cannot find module`.

- [ ] **Step 3: Implementar `lib/indice.mjs`**

```js
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
```

- [ ] **Step 4: Implementar `lib/construir.mjs` y el CLI**

`lib/construir.mjs`:

```js
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
```

`construir.mjs`:

```js
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
```

- [ ] **Step 5: Comprobar que pasan y que toda la suite sigue verde**

Run: `node --test`
Expected: todas las pruebas pasan (md 3, pagina 3, enunciado 5, ayudas-logica 4, glosario 6, presentacion 6, notas 5, indice 3, construir 4).

- [ ] **Step 6: Commit**

```bash
git add lib/indice.mjs lib/construir.mjs construir.mjs tests/indice.test.mjs tests/construir.test.mjs
git commit -m "Añade índice, orquestador y prueba de extremo a extremo del generador"
```

---

### Task 7: Migrar el contenido de 6.1 al nuevo formato

**Files:**
- Create: `contenido/u1/unidad.json`, `contenido/u1/6.1-crear-hilos/{apartado.json,enunciado.md,presentacion.md}`, `glosario/*.md`, `privado/u1/6.1-crear-hilos/notas-profesor.md`
- Move: los cuatro proyectos Java a `contenido/u1/6.1-crear-hilos/proyectos/`
- Create y borrar al terminar: `herramientas/migrar-glosario.mjs`, `herramientas/migrar-presentacion.mjs`
- Delete: `clases/6.1-crear-hilos/{enunciado.html,enunciado.md,notas-profesor.html,notas-profesor.md,presentacion.html}`, `glosario/glosario.html`, `index.html`

**Interfaces:**
- Consumes: el contenido actual de `clases/6.1-crear-hilos/`, `glosario/glosario.html`. Produces: un `contenido/` y un `glosario/` que `construir` acepta sin errores.

- [ ] **Step 1: Mover los proyectos y las notas**

```bash
cd /Users/clases/PSP
mkdir -p contenido/u1/6.1-crear-hilos/proyectos privado/u1/6.1-crear-hilos
for p in CrearHilos EjemploPerrosGatos CincoPerrosGatos OperacionesArray; do
  git mv "clases/6.1-crear-hilos/$p" "contenido/u1/6.1-crear-hilos/proyectos/$p"
done
cp clases/6.1-crear-hilos/notas-profesor.md privado/u1/6.1-crear-hilos/notas-profesor.md
git rm -q clases/6.1-crear-hilos/notas-profesor.md clases/6.1-crear-hilos/notas-profesor.html
git status --short | head -30
```

Expected: los 12 `.java` aparecen como renombrados; `privado/` no aparece en git (ignorado).

- [ ] **Step 2: Crear `unidad.json` y `apartado.json`**

`contenido/u1/unidad.json`:

```json
{ "titulo": "Unidad 1", "orden": 1 }
```

`contenido/u1/6.1-crear-hilos/apartado.json`:

```json
{
  "titulo": "6.1 Crear hilos en Java",
  "orden": 1,
  "resumen": "Hilos con Runnable: contadores, Gato y Perro, arrays de hilos y operaciones sobre un array."
}
```

- [ ] **Step 3: Convertir el glosario antiguo a fichas**

Crear `herramientas/migrar-glosario.mjs`:

```js
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('glosario/glosario.html', 'utf8');
const desescapar = (t) => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const aTexto = (t) => desescapar(t.replace(/<code>(.*?)<\/code>/g, '`$1`').replace(/<[^>]+>/g, ''));
const slug = (n) =>
  n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

mkdirSync('glosario', { recursive: true });
const articulos = html.match(/<article class="ficha"[\s\S]*?<\/article>/g);
for (const art of articulos) {
  const nombre = desescapar(/<h2>([\s\S]*?)<\/h2>/.exec(art)[1].replace(/<[^>]+>/g, ''));
  const que = /<dt>Qué es<\/dt><dd>([\s\S]*?)<\/dd>/.exec(art)[1];
  const para = /<dt>Para qué sirve<\/dt><dd>([\s\S]*?)<\/dd>/.exec(art)[1];
  const ejemplo = /<dt>Ejemplo mínimo<\/dt><dd><pre><code>([\s\S]*?)<\/code><\/pre><\/dd>/.exec(art)[1];
  const cerca = '`'.repeat(3);
  const ficha = `---\nnombre: ${nombre}\n---\n\n## Qué es\n\n${aTexto(que)}\n\n## Para qué sirve\n\n${aTexto(para)}\n\n## Ejemplo mínimo\n\n${cerca}java\n${desescapar(ejemplo)}\n${cerca}\n`;
  writeFileSync(`glosario/${slug(nombre)}.md`, ficha);
  console.log(`glosario/${slug(nombre)}.md  ←  ${nombre}`);
}
console.log(`${articulos.length} fichas`);
```

Run: `node herramientas/migrar-glosario.mjs`
Expected: `18 fichas` y 18 archivos `.md` en `glosario/`. Abrir al menos `glosario/array-int-thread.md` y `glosario/new-thread-objeto-nombre.md` y comprobar que el nombre, las comillas y el ejemplo son correctos.

- [ ] **Step 4: Escribir el `enunciado.md` nuevo con las ayudas**

`contenido/u1/6.1-crear-hilos/enunciado.md`:

````markdown
# Apartado 6.1 – Crear hilos en Java

Trabaja con `Runnable`. Cada ejercicio es un proyecto de NetBeans distinto. Las clases van en el paquete `crearhilos`.

## Ejercicio 1: tres hilos contadores (proyecto `CrearHilos`)

Crea tres hilos que cuentan del 1 al 10. En cada paso muestra por pantalla:

```
Hilo x: y
```

`x` es el número del hilo (1, 2 o 3). `y` es el número que está contando. Ejemplo: `Hilo 2: 7`.

Clases:
- `Contador`: implementa `Runnable`. Su método `run()` cuenta del 1 al 10. Muestra el nombre del hilo con `Thread.currentThread().getName()`.
- `Principal`: crea los tres hilos con `new Thread(new Contador(), "Hilo 1")` (y "Hilo 2", "Hilo 3") y los lanza con `start()`.

### Ayuda ligera
Los tres hilos hacen exactamente lo mismo. Piensa cuántas clases con `run()` necesitas de verdad, y cómo sabe cada hilo quién es.

### Más ayuda
Necesitas una sola clase, `Contador`, que implementa `Runnable`. Dentro de `run()` va un bucle `for` que cuenta del 1 al 10. El número del hilo no se guarda en la clase: cada `Thread` recibe un nombre cuando se crea, y `Thread.currentThread().getName()` devuelve el nombre del hilo que está ejecutando el código. La clase `Principal` crea tres objetos `Thread` con tres nombres distintos y los arranca.

### Paso a paso
1. Crea el proyecto `CrearHilos` y el paquete `crearhilos`.
2. Crea la clase `Contador` y haz que implemente `Runnable`.
3. Escribe el método `run()` con la etiqueta `@Override`.
4. Dentro de `run()`, escribe un bucle `for` que vaya del 1 al 10.
5. En cada vuelta, muestra con `System.out.println` el nombre del hilo, dos puntos y el número de la vuelta.
6. Crea la clase `Principal` con el método `main`.
7. En `main`, crea tres objetos `Thread`. A cada uno pásale un `Contador` nuevo y un nombre: "Hilo 1", "Hilo 2" y "Hilo 3".
8. Llama a `start()` en los tres hilos, después de haberlos creado.
9. Ejecuta el programa varias veces y compara las salidas.

## Ejercicio 2: Gato y Perro (proyecto `EjemploPerrosGatos`)

Clases:
- `Gato`: implementa `Runnable`. Su método `run()` muestra `Miau!`.
- `Perro`: implementa `Runnable`. Su método `run()` muestra `Guau!`.
- `Principal`: crea un hilo con un `Gato` y otro con un `Perro`, y los lanza con `start()`.

### Ayuda ligera
Son dos clases muy pequeñas, una por animal. Cada una solo escribe una palabra. Lo importante es cómo se convierten en hilos.

### Más ayuda
`Gato` y `Perro` implementan `Runnable` y tienen su método `run()`: el de `Gato` muestra `Miau!` y el de `Perro` muestra `Guau!`, con `System.out.println`. Ninguna de las dos es un hilo por sí sola: en `Principal` se crea un objeto `Thread` con cada una, y se llama a `start()` en los dos.

### Paso a paso
1. Crea el proyecto `EjemploPerrosGatos` y el paquete `crearhilos`.
2. Crea la clase `Gato`, que implementa `Runnable`.
3. En su método `run()`, muestra `Miau!`.
4. Crea la clase `Perro` del mismo modo, pero que muestre `Guau!`.
5. Crea la clase `Principal` con `main`.
6. En `main`, crea un `Thread` con un `Gato` y otro `Thread` con un `Perro`.
7. Llama a `start()` en los dos hilos.
8. Ejecuta varias veces y fíjate en qué palabra sale primero.

## Ejercicio 3: cinco gatos y cinco perros (proyecto `CincoPerrosGatos`)

Amplía el ejercicio 2 para lanzar 5 hilos `Gato` y 5 hilos `Perro`.

- Crea dos arrays de 5 hilos (`Thread[]`): uno para los gatos y otro para los perros.
- Con un `for` de 5 iteraciones, crea y lanza un gato y un perro en cada vuelta (en la primera, un `Gato` y un `Perro`; en la siguiente, otro de cada, y así hasta 5).
- Cada hilo muestra su nombre y su sonido. Ejemplo: `Gato 3: Miau!`.

### Ayuda ligera
En vez de crear diez hilos con diez variables sueltas, guárdalos en dos arrays y deja que un bucle haga el trabajo repetido.

### Más ayuda
Necesitas dos arrays de tipo `Thread` con tamaño 5, uno para gatos y otro para perros. Un bucle `for` de cinco vueltas crea en cada vuelta un hilo gato y un hilo perro, los guarda en la posición de esa vuelta y los arranca con `start()`. Las posiciones de un array empiezan en 0, pero los nombres deben empezar en 1. Para que cada hilo diga quién es, `Gato` y `Perro` muestran el nombre del hilo con `Thread.currentThread().getName()`, además de su sonido.

### Paso a paso
1. Crea el proyecto `CincoPerrosGatos` y el paquete `crearhilos`.
2. Crea las clases `Gato` y `Perro`, que implementan `Runnable`.
3. En el `run()` de cada una, muestra el nombre del hilo, dos puntos y el sonido (`Miau!` o `Guau!`).
4. En `Principal`, dentro de `main`, declara dos arrays de `Thread` de tamaño 5: uno para gatos y otro para perros.
5. Escribe un bucle `for` que vaya de la posición 0 a la 4.
6. En cada vuelta, crea un `Thread` con un `Gato` nuevo y guárdalo en el array de gatos. El nombre será "Gato" seguido del número de vuelta más uno.
7. En la misma vuelta, haz lo mismo con el `Perro` y el array de perros.
8. En la misma vuelta, llama a `start()` en los dos hilos nuevos.
9. Ejecuta varias veces y comprueba que el orden de la salida cambia.

## Ejercicio 4: operaciones con un array (proyecto `OperacionesArray`)

Tenemos un array de 10 enteros. Un hilo los suma, otro los resta y otro los multiplica.

Pista: pasa el array al constructor de cada clase y guárdalo en un atributo. Después puedes usar tres clases distintas (`HiloSuma`, `HiloResta`, `HiloMultiplica`) o una sola clase con un `switch`.

### Ayuda ligera
El método `run()` no recibe nada de fuera. Piensa por dónde puede entrar el array en la clase antes de que el hilo empiece a trabajar.

### Más ayuda
El array entra por el constructor y se guarda en un atributo privado de la clase; `run()` lo recorre con un bucle `for`. Cada operación necesita su valor de partida: la suma empieza en 0, la multiplicación empieza en 1, y la resta parte del primer elemento y resta desde el segundo. Puedes hacer tres clases (`HiloSuma`, `HiloResta` y `HiloMultiplica`) o una sola que reciba también el nombre de la operación y use un `switch`.

### Paso a paso
1. Crea el proyecto `OperacionesArray` y el paquete `crearhilos`.
2. Crea la clase `HiloSuma` y haz que implemente `Runnable`.
3. Añade un atributo privado de tipo array de enteros.
4. Escribe un constructor que reciba el array y lo guarde en ese atributo con `this`.
5. En `run()`, crea una variable total que empiece en 0 y recorre el array con un `for` sumando cada elemento.
6. Al terminar, muestra el nombre del hilo y el resultado.
7. Crea `HiloResta` y `HiloMultiplica` igual. La resta empieza con el primer elemento y recorre desde el segundo; la multiplicación empieza en 1.
8. En `Principal`, crea el array de 10 enteros con los valores del 1 al 10.
9. Crea tres hilos, cada uno con su clase, pasándoles el mismo array y un nombre ("Hilo 1", "Hilo 2" y "Hilo 3").
10. Arranca los tres con `start()` y comprueba los resultados: suma 55, resta -53 y multiplicación 3628800.

## Preguntas

1. Ejecuta el ejercicio 1 varias veces. ¿Sale siempre igual? ¿Por qué?
2. Ejecuta el ejercicio 2 varias veces. ¿Sale siempre primero `Miau!`?
3. Ejecuta el ejercicio 3 varias veces. ¿Salen siempre alternados (Gato 1, Perro 1, Gato 2...), aunque se lancen así? ¿Por qué?
4. En el ejercicio 4, ¿importa que los tres hilos lean el mismo array a la vez? ¿Y si un hilo lo modificara?
````

- [ ] **Step 5: Convertir la presentación a `presentacion.md`**

Crear `herramientas/migrar-presentacion.mjs`:

```js
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const origen = 'clases/6.1-crear-hilos/presentacion.html';
const proyectos = 'contenido/u1/6.1-crear-hilos/proyectos';
const destino = 'contenido/u1/6.1-crear-hilos/presentacion.md';

const desescapar = (t) => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const normal = (t) => t.split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim();

function archivosJava(dir) {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? archivosJava(ruta) : ruta.endsWith('.java') ? [ruta] : [];
  });
}

const indice = new Map();
for (const f of archivosJava(proyectos)) {
  const texto = readFileSync(f, 'utf8').replace(/^package [^;]+;\n+/, '');
  const proyecto = f.slice(proyectos.length + 1).split('/')[0];
  indice.set(normal(texto), `${proyecto}/${f.split('/').pop()}`);
}

function sustituirCodigo(html) {
  return html.replace(/<pre><code class="language-java"([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (todo, attrs, cuerpo) => {
    const ref = indice.get(normal(desescapar(cuerpo)));
    if (!ref) return todo;
    const m = /data-line-numbers="([^"]*)"/.exec(attrs);
    console.log(`  código incluido: ${ref}`);
    return `{{codigo: ${ref}${m ? ` @@ ${m[1]}` : ''}}}`;
  });
}

function extraerSecciones(html) {
  const salida = [];
  const re = /<section\b[^>]*>|<\/section>/g;
  let profundidad = 0;
  let inicio = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('</')) {
      profundidad--;
      if (profundidad === 0) salida.push(html.slice(inicio, m.index));
    } else {
      if (profundidad === 0) inicio = m.index + m[0].length;
      profundidad++;
    }
  }
  return salida;
}

const html = readFileSync(origen, 'utf8');
const abre = '<div class="slides">';
const cuerpo = html.slice(html.indexOf(abre) + abre.length, html.indexOf('</div>\n</div>\n\n<script'));
const limpiar = (t) => t.replace(/^\s*\n/, '').replace(/\s+$/, '');

const diapositivas = extraerSecciones(cuerpo).map((top) => {
  const hijos = top.includes('<section') ? extraerSecciones(top) : [top];
  return hijos.map((h) => `<!-- html -->\n${limpiar(sustituirCodigo(h))}`).join('\n\n--\n\n');
});
writeFileSync(destino, diapositivas.join('\n\n---\n\n') + '\n');
console.log(`${diapositivas.length} bloques horizontales escritos en ${destino}`);
```

Run: `node herramientas/migrar-presentacion.mjs`
Expected: salida con `código incluido: CrearHilos/Contador.java` y `código incluido: OperacionesArray/HiloSuma.java`, y una línea final con el número de bloques (10 secciones de nivel superior en el HTML actual). El resto del código de las diapositivas se queda en línea porque son trozos de varias clases, no archivos completos.

- [ ] **Step 6: Borrar lo antiguo y las herramientas de una sola vez**

```bash
git rm -q clases/6.1-crear-hilos/enunciado.html clases/6.1-crear-hilos/enunciado.md clases/6.1-crear-hilos/presentacion.html glosario/glosario.html index.html
rm -r herramientas
git status --short | head -40
```

Expected: `herramientas/` ya no existe; `clases/` solo conserva archivos de NetBeans ignorados por git.

- [ ] **Step 7: Construir y comprobar que la migración es válida**

Run: `PSP_FRASE="frase provisional de prueba" node construir.mjs`
Expected: `Listo: 1 unidades, 1 apartados, 18 términos.` y nada de `Error:`.

- [ ] **Step 8: Commit** (aún sin `docs/`: se genera y se sube en la Tarea 9, con la frase definitiva)

```bash
git add contenido glosario .gitignore
git commit -m "Migra 6.1 al nuevo formato de contenido y glosario"
```

---

### Task 8: Verificación completa

**Files:** ninguno nuevo. Se comprueba el resultado de las tareas 1 a 7.

- [ ] **Step 1: Suite de pruebas y construcción limpia**

```bash
cd /Users/clases/PSP
node --test 2>&1 | tail -12
PSP_FRASE="frase provisional de prueba" node construir.mjs
```

Expected: `# fail 0`; `Listo: 1 unidades, 1 apartados, 18 términos.`

- [ ] **Step 2: Compilar y ejecutar cada proyecto Java**

```bash
S=/private/tmp/claude-502/-Users-clases-PSP/4c79ca5b-9adf-4645-84b7-2ed4ca6f76b8/scratchpad
for p in CrearHilos EjemploPerrosGatos CincoPerrosGatos OperacionesArray; do
  rm -rf "$S/v/$p"; mkdir -p "$S/v/$p"
  javac -d "$S/v/$p" contenido/u1/6.1-crear-hilos/proyectos/$p/src/crearhilos/*.java && echo "== $p" && java -cp "$S/v/$p" crearhilos.Principal | head -4
done
```

Expected: los cuatro compilan sin errores y muestran salida.

- [ ] **Step 3: Comprobar que las notas no se leen sin la frase**

```bash
grep -c "Errores típicos" docs/u1/6.1-crear-hilos/notas-profesor.html
git check-ignore privado/u1/6.1-crear-hilos/notas-profesor.md
```

Expected: `0` (el texto en claro no está en el HTML) y se imprime la ruta (git la ignora).

- [ ] **Step 4: Comprobar las páginas en el navegador**

```bash
python3 -m http.server 8765 --directory docs --bind 127.0.0.1 &
```

Con las herramientas de Chrome (cargarlas con ToolSearch si hacen falta), abrir `http://127.0.0.1:8765/` y comprobar, sin errores en la consola (`read_console_messages`):
1. Índice: aparece "6.1 Crear hilos en Java" con tres botones (Presentación, Enunciado, 🔒 Notas) y el enlace al glosario.
2. Enunciado: en cada ejercicio hay tres botones; "Más ayuda" y "Paso a paso" empiezan deshabilitados; al pulsar "Ayuda ligera" se abre y habilita el siguiente; al recargar la página se conserva lo abierto; al cerrar la primera se cierran las demás. Ninguna ayuda contiene bloques de código.
3. Notas: con una frase errónea sale "Código incorrecto."; con `frase provisional de prueba` aparece el contenido.
4. Glosario: 18 fichas; el buscador filtra (por ejemplo "hilo"); `array` aparece antes que `@Override`.
5. Presentación: se ve con el tema, el resaltado de líneas paso a paso funciona en la diapositiva de `Contador`, y las cajas `aviso`, `caja` y `salida` conservan su aspecto.
6. El botón ◐ cambia entre tema claro y oscuro en todas las páginas; la presentación respeta el tema del sistema.

Después: `kill %1` para parar el servidor.

- [ ] **Step 5: Corregir lo que falle y repetir**

Si algún punto del paso 4 falla, corregir el módulo o el CSS responsable, añadir una prueba cuando sea lógica comprobable, volver a ejecutar los pasos 1 y 4 y hacer un commit `fix: ...` con el cambio.

---

### Task 9: Skills, memoria y publicación

**Files:**
- Modify: `.claude/skills/preparar-clase-psp/SKILL.md`, `.claude/skills/tutor-java-psp/SKILL.md` (solo si menciona rutas antiguas)
- Modify: memoria del proyecto (`proyecto-psp-2dam.md`, `flujo-material-nuevo.md`)
- Commit: `docs/`

- [ ] **Step 1: Actualizar la skill `preparar-clase-psp`**

Leer `.claude/skills/preparar-clase-psp/SKILL.md` entero y cambiar:
- La lista de lo que se genera en `clases/<apartado>/` (enunciado.md, proyectos, notas-profesor.md, presentacion.html) por esta, con el mismo estilo de redacción del archivo:
  1. `contenido/<unidad>/<apartado>/enunciado.md`: ejercicios con `### Ayuda ligera`, `### Más ayuda` y `### Paso a paso` (solo palabras, sin bloques de código, sin solución).
  2. Proyectos NetBeans en `contenido/<unidad>/<apartado>/proyectos/` según la sección "Estilo del profesor".
  3. `contenido/<unidad>/<apartado>/presentacion.md`: diapositivas separadas por `---` (verticales con `--`), código con `{{codigo: Proyecto/Archivo.java}}` cuando muestre un archivo completo.
  4. `privado/<unidad>/<apartado>/notas-profesor.md`: errores típicos y puntos a explicar (no va a git; se publica cifrada).
  5. Una ficha `glosario/<termino>.md` por cada término nuevo (cabecera `nombre:` y los campos `Qué es`, `Para qué sirve` y `Ejemplo mínimo`).
  6. `contenido/<unidad>/<apartado>/apartado.json` y, si la unidad es nueva, `contenido/<unidad>/unidad.json`.
- La instrucción de glosario (que hablaba de `glosario.html`) por: crear las fichas nuevas sin duplicar términos; el generador falla si hay duplicados.
- Añadir al final: «Después de escribir las fuentes, ejecuta `PSP_FRASE=... node construir.mjs` y `node --test`, compila los proyectos con `javac` y revisa `docs/` en el navegador antes de dar nada por hecho.»

- [ ] **Step 2: Actualizar la memoria**

En `/Users/clases/.claude/projects/-Users-clases-PSP/memory/`:
- `proyecto-psp-2dam.md`: sustituir la estructura por la nueva (`contenido/`, `glosario/*.md`, `privado/`, `estilo/`, `lib/`, `construir.mjs`, `docs/` servido por Pages), anotar que las URL son ahora `.../u1/<apartado>/...` y que el diseño está en `diseno/`.
- `flujo-material-nuevo.md`: cambiar los archivos a actualizar por las fuentes nuevas y añadir: tras escribir las fuentes, `node construir.mjs` con `PSP_FRASE` (la define el usuario; no se guarda en ningún archivo) y regenerar `docs/`.
- `git-github-psp.md`: quitar la línea de `.gitignore` obsoleta y el «Pendiente» de las notas (resuelto: cifradas); anotar que las notas de 6.1 siguen visibles en el historial antiguo, por decisión del usuario.

- [ ] **Step 3: Pedir al usuario la frase definitiva y regenerar**

El usuario ejecuta, en su Terminal, con su frase de 4 palabras o más (no se la debe pasar a Claude si prefiere no hacerlo):

```bash
cd /Users/clases/PSP && PSP_FRASE='su frase definitiva aquí' node construir.mjs
```

Expected: `Listo: 1 unidades, 1 apartados, 18 términos.` Si el usuario prefiere que lo haga Claude con una frase provisional, se avisa de que las notas quedan cifradas con ella hasta que el usuario regenere.

- [ ] **Step 4: Commit de `docs/` y del resto**

```bash
cd /Users/clases/PSP
git add -A
git status --short | head -40
git commit -m "Genera docs/ con el nuevo formato y actualiza las skills"
```

Expected: el estado no incluye `privado/` ni `node_modules/`. `docs/` sí se sube.

- [ ] **Step 5: Push y cambio de la carpeta de Pages**

```bash
git push
gh api -X PUT repos/jlcrmaths/psp-2dam/pages -f "source[branch]=main" -f "source[path]=/docs"
```

Si `gh api` falla por permisos, el usuario lo cambia a mano en GitHub: Settings → Pages → Branch `main`, carpeta `/docs`.

- [ ] **Step 6: Comprobar la web publicada**

Esperar 1 o 2 minutos y ejecutar:

```bash
for r in "" u1/6.1-crear-hilos/enunciado.html u1/6.1-crear-hilos/presentacion.html u1/6.1-crear-hilos/notas-profesor.html glosario/index.html estilo/tema.css; do
  curl -s -o /dev/null -w "%{http_code} $r\n" "https://jlcrmaths.github.io/psp-2dam/$r"
done
```

Expected: `200` en todas. Si alguna da `404`, esperar otro minuto y repetir; si persiste, revisar la carpeta publicada en Settings → Pages. Comprobar además en el navegador que la pantalla de acceso de las notas admite la frase definitiva.
