// Genera el banco de preguntas de repaso de la Unidad 1 en formato Moodle XML.
// Uso: node cuestionarios/generar-cuestionario.mjs
// Salida: cuestionarios/repaso-u1-moodle.xml y cuestionarios/repaso-u1-presentacion.html (con --comprobar, también cuestionarios/comprobar-java/).
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));

// ---------- utilidades de texto ----------
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Texto con `código` en línea -> HTML.
const md = (s) => xml(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const pre = (s) => '<pre>' + xml(s.replace(/^\n|\n$/g, '')) + '</pre>';
const cdata = (s) => '<![CDATA[' + s + ']]>';
const html = (s) => `<text>${cdata(s)}</text>`;
const plain = (s) => `<text>${xml(s)}</text>`;

const preguntas = []; // XML ya construido, en orden
const paraCompilar = []; // { nombre, java }
let contador = 0;

function categoria(ruta) {
  catActual = ruta.split('/').pop();
  preguntas.push(`<question type="category"><category><text>$course$/top/${xml(ruta)}</text></category></question>`);
}

function nombre(prefijo, titulo) {
  contador++;
  ultimoNombre = `${prefijo}-${String(contador).padStart(2, '0')} ${titulo}`;
  return `${prefijo}-${String(contador).padStart(2, '0')} ${titulo}`;
}

const sinFeedback = `<correctfeedback format="html"><text></text></correctfeedback>
<partiallycorrectfeedback format="html"><text></text></partiallycorrectfeedback>
<incorrectfeedback format="html"><text></text></incorrectfeedback>`;

function cabecera(tipo, nom, texto, explicacion, grado = 1, penalizacion = '0.3333333') {
  return `<question type="${tipo}">
<name><text>${xml(nom)}</text></name>
<questiontext format="html">${html(texto)}</questiontext>
<generalfeedback format="html">${html(explicacion ? '<p>' + md(explicacion) + '</p>' : '')}</generalfeedback>
<defaultgrade>${grado}</defaultgrade>
<penalty>${penalizacion}</penalty>
<hidden>0</hidden>`;
}

// Texto de la pregunta: párrafo(s) + código opcional.
const cuerpo = (texto, codigo) => '<p>' + md(texto) + '</p>' + (codigo ? pre(codigo) : '');

// Registra código para comprobar que compila.
function registra(nom, java) {
  paraCompilar.push({ nom, java });
}


// ---------- diapositivas (presentación de repaso en clase) ----------
const diapos = []; // { cat, nom, tipo, enun, resp, expl }
let catActual = '';
let ultimoNombre = '';

// Barajado repetible: la presentación sale igual cada vez que se genera.
function barajar(lista, semilla) {
  let a = semilla * 2654435761 >>> 0;
  const azar = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = lista.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function diapo(tipo, enun, resp, expl) {
  diapos.push({ cat: catActual, nom: ultimoNombre, tipo, enun, resp, expl: expl ? '<p>' + md(expl) + '</p>' : '' });
}

function listaOpciones(opciones, marcar) {
  const lista = barajar(opciones, contador);
  return '<ol class="op" type="a">' + lista
    .map((o) => `<li class="${marcar ? (o[1] ? 'ok' : 'no') : ''}">${md(o[0])}${marcar && o[1] ? ' <b>✔</b>' : ''}</li>`)
    .join('') + '</ol>';
}

// Convierte las marcas ⟦sa|mc|num:...⟧ en huecos numerados (pregunta) o en respuestas resaltadas (solución).
// Cada hueco numerado tiene su color (clase c1..c8) en el hueco, en su desplegable y en la respuesta.
const col = (n) => 'c' + (((n - 1) % 8) + 1);

function huecosMarcas(htmlConMarcas) {
  let n = 0;
  const opcionesMc = [];
  const pregunta = htmlConMarcas.replace(/⟦(sa|mc|num):([^⟧]*)⟧/g, (_, t, c) => {
    n++;
    if (t === 'mc') opcionesMc.push(`<span class="grupo ${col(n)}"><span class="chip num">${n}</span> ${barajar(c.split('|'), contador + n).map((x) => '<code>' + xml(x) + '</code>').join(' · ')}</span>`);
    return `<span class="hueco ${col(n)}">${n}</span>`;
  });
  let m = 0;
  const solucion = htmlConMarcas.replace(/⟦(sa|mc|num):([^⟧]*)⟧/g, (_, t, c) => `<mark class="${col(++m)}">${c.split('|')[0]}</mark>`);
  const ayuda = opcionesMc.length ? '<p class="peque">Desplegables: ' + opcionesMc.join(' &nbsp; ') + '</p>' : '';
  return { pregunta, solucion, ayuda };
}

function huecosArrastrar(htmlConHuecos, opciones, infinitas, coloreado = false) {
  const c = (i) => (coloreado ? ' ' + col(Number(i)) : '');
  const pregunta = htmlConHuecos.replace(/\[\[(\d+)\]\]/g, (_, i) => `<span class="hueco${c(i)}">${i}</span>`);
  const solucion = htmlConHuecos.replace(/\[\[(\d+)\]\]/g, (_, i) => `<mark class="${c(i).trim()}">${xml(opciones[i - 1])}</mark>`);
  const chips = barajar(opciones, contador).map((o) => `<span class="chip">${xml(o)}</span>`).join(' ');
  const nota = infinitas.length ? ' Algunas se usan más de una vez.' : '';
  return { pregunta, solucion, ayuda: `<p class="peque">Palabras (algunas sobran):${nota}</p><p>${chips}</p>` };
}

// ---------- tipos de pregunta ----------
const FRACCION = { 2: '50', 3: '33.33333', 4: '25', 5: '20' };
const NEGATIVA = { 1: '-100', 2: '-50', 3: '-33.33333', 4: '-25', 5: '-20' };

// Elección única: opciones = [texto, correcta]
function test(pref, titulo, texto, opciones, explicacion, { codigo, grado } = {}) {
  const n = opciones.filter((o) => o[1]).length;
  if (n !== 1) throw new Error('test: debe haber 1 correcta: ' + titulo);
  const resp = opciones
    .map((o) => `<answer fraction="${o[1] ? 100 : 0}" format="html">${html(md(o[0]))}<feedback format="html"><text></text></feedback></answer>`)
    .join('\n');
  preguntas.push(`${cabecera('multichoice', nombre(pref, titulo), cuerpo(texto, codigo), explicacion, grado)}
<single>true</single><shuffleanswers>true</shuffleanswers><answernumbering>abc</answernumbering>
${sinFeedback}<shownumcorrectfeedback>0</shownumcorrectfeedback>
${resp}
</question>`);
  diapo('Test', cuerpo(texto, codigo) + listaOpciones(opciones, false), listaOpciones(opciones, true), explicacion);
}

// Elección múltiple
function multi(pref, titulo, texto, opciones, explicacion, { codigo, grado } = {}) {
  const buenas = opciones.filter((o) => o[1]).length;
  const malas = opciones.length - buenas;
  if (!FRACCION[buenas] || !NEGATIVA[malas]) throw new Error('multi: fracciones no válidas: ' + titulo);
  const resp = opciones
    .map((o) => `<answer fraction="${o[1] ? FRACCION[buenas] : NEGATIVA[malas]}" format="html">${html(md(o[0]))}<feedback format="html"><text></text></feedback></answer>`)
    .join('\n');
  preguntas.push(`${cabecera('multichoice', nombre(pref, titulo), cuerpo(texto, codigo), explicacion, grado)}
<single>false</single><shuffleanswers>true</shuffleanswers><answernumbering>abc</answernumbering>
${sinFeedback}<shownumcorrectfeedback>1</shownumcorrectfeedback>
${resp}
</question>`);
  diapo('Varias correctas', cuerpo(texto, codigo) + listaOpciones(opciones, false), listaOpciones(opciones, true), explicacion);
}

function vf(pref, titulo, texto, verdadero, explicacion, { codigo } = {}) {
  preguntas.push(`${cabecera('truefalse', nombre(pref, titulo), cuerpo(texto, codigo), explicacion, 1, '1.0000000')}
<answer fraction="${verdadero ? 100 : 0}" format="moodle_auto_format"><text>true</text><feedback format="html"><text></text></feedback></answer>
<answer fraction="${verdadero ? 0 : 100}" format="moodle_auto_format"><text>false</text><feedback format="html"><text></text></feedback></answer>
</question>`);
  diapo('Verdadero o falso', cuerpo(texto, codigo) + '<p class="sol">¿Verdadero o falso?</p>', `<p class="sol ${verdadero ? 'ok' : 'no'}">${verdadero ? 'VERDADERO' : 'FALSO'}</p>`, explicacion);
}

// Respuesta corta. correctas: lista de patrones (admiten *)
function corta(pref, titulo, texto, correctas, explicacion, { codigo, mayusculas = false } = {}) {
  const resp = correctas
    .map((c) => `<answer fraction="100" format="plain_text">${plain(c)}<feedback format="html"><text></text></feedback></answer>`)
    .join('\n');
  preguntas.push(`${cabecera('shortanswer', nombre(pref, titulo), cuerpo(texto, codigo), explicacion)}
<usecase>${mayusculas ? 1 : 0}</usecase>
${resp}
</question>`);
  diapo('Respuesta corta', cuerpo(texto, codigo), `<p class="sol">${correctas.map((c) => '<code>' + xml(c) + '</code>').join(' &nbsp;·&nbsp; ')}</p>`, explicacion);
}

function numerica(pref, titulo, texto, valor, explicacion, { codigo, tolerancia = 0 } = {}) {
  preguntas.push(`${cabecera('numerical', nombre(pref, titulo), cuerpo(texto, codigo), explicacion)}
<answer fraction="100" format="plain_text"><text>${valor}</text><feedback format="html"><text></text></feedback><tolerance>${tolerancia}</tolerance></answer>
<unitgradingtype>0</unitgradingtype><unitpenalty>0.1000000</unitpenalty><showunits>3</showunits><unitsleft>0</unitsleft>
</question>`);
  diapo('Numérica', cuerpo(texto, codigo), `<p class="sol">${valor}</p>`, explicacion);
}

// Emparejar: pares = [enunciado, respuesta]
function emparejar(pref, titulo, texto, pares, explicacion, { grado } = {}) {
  const sub = pares
    .map((p) => `<subquestion format="html">${html(md(p[0]))}<answer>${plain(p[1])}</answer></subquestion>`)
    .join('\n');
  preguntas.push(`${cabecera('matching', nombre(pref, titulo), cuerpo(texto), explicacion, grado)}
<shuffleanswers>true</shuffleanswers>
${sinFeedback}<shownumcorrectfeedback>1</shownumcorrectfeedback>
${sub}
</question>`);
  const dcha = barajar(pares.map((p) => p[1]), contador).map((r) => `<span class="chip">${xml(r)}</span>`).join(' ');
  diapo('Emparejar', cuerpo(texto) + '<ul class="par">' + pares.map((p) => `<li>${md(p[0])}</li>`).join('') + '</ul><p>' + dcha + '</p>', '<table class="par">' + pares.map((p) => `<tr><td>${md(p[0])}</td><td>→</td><td><mark>${xml(p[1])}</mark></td></tr>`).join('') + '</table>', explicacion);
}

// Redacción (se corrige a mano). modelo = solución para el profesor.
function redaccion(pref, titulo, texto, modelo, plantilla, { grado = 5, lineas = 18 } = {}) {
  preguntas.push(`<question type="essay">
<name><text>${xml(nombre(pref, titulo))}</text></name>
<questiontext format="html">${html(cuerpo(texto))}</questiontext>
<generalfeedback format="html">${html('<p>Solución de ejemplo:</p>' + pre(modelo))}</generalfeedback>
<defaultgrade>${grado}</defaultgrade><penalty>0</penalty><hidden>0</hidden>
<responseformat>monospaced</responseformat><responserequired>1</responserequired>
<responsefieldlines>${lineas}</responsefieldlines><attachments>0</attachments><attachmentsrequired>0</attachmentsrequired>
<graderinfo format="html">${html('<p>Solución de ejemplo (acepta variantes equivalentes):</p>' + pre(modelo))}</graderinfo>
<responsetemplate format="html">${html('')}</responsetemplate>
</question>`);
  void plantilla;
  diapo('Redacción', cuerpo(texto), pre(modelo), '');
}

// Completar código escribiendo. Marcas dentro del código:
//   ⟦sa:a|b⟧  respuesta corta (primera = principal, distingue mayúsculas)
//   ⟦mc:buena|mala|mala⟧  desplegable
//   ⟦num:5⟧  número
function completar(pref, titulo, texto, codigo, explicacion, { grado, compilar = true } = {}) {
  const nom = nombre(pref, titulo);
  const clave = codigo.replace(/⟦(sa|mc|num):([^⟧]*)⟧/g, (_, t, c) => c.split('|')[0]);
  if (compilar) registra(nom, clave);
  const esc = (s) => s.replace(/[\\}~#\/]/g, (c) => '\\' + c);
  const cuerpoHtml = xml(codigo).replace(/⟦(sa|mc|num):([^⟧]*)⟧/g, (_, t, c) => {
    const o = c.split('|');
    if (t === 'sa') return '{1:SHORTANSWER_C:' + o.map((x) => '=' + esc(x)).join('~') + '}';
    if (t === 'num') return '{1:NUMERICAL:=' + o[0] + '}';
    return '{1:MULTICHOICE_S:=' + esc(o[0]) + '~' + o.slice(1).map(esc).join('~') + '}';
  });
  const n = (codigo.match(/⟦/g) || []).length;
  preguntas.push(`<question type="cloze">
<name><text>${xml(nom)}</text></name>
<questiontext format="html">${html('<p>' + md(texto) + '</p><pre>' + cuerpoHtml.replace(/^\n|\n$/g, '') + '</pre>')}</questiontext>
<generalfeedback format="html">${html('<p>' + md(explicacion) + '</p>')}</generalfeedback>
<penalty>0.3333333</penalty><hidden>0</hidden>
</question>`);
  const h = huecosMarcas(xml(codigo));
  diapo('Completar código', '<p>' + md(texto) + '</p><pre>' + h.pregunta.replace(/^\n|\n$/g, '') + '</pre>' + h.ayuda, '<pre>' + h.solucion.replace(/^\n|\n$/g, '') + '</pre>', explicacion);
  void n;
  void grado;
}

// Cloze sin código: texto normal con huecos numéricos / cortos / desplegables.
function completarTexto(pref, titulo, texto, explicacion) {
  const nom = nombre(pref, titulo);
  const esc = (s) => s.replace(/[\\}~#\/]/g, (c) => '\\' + c);
  const cuerpoHtml = md(texto).replace(/⟦(sa|mc|num):([^⟧]*)⟧/g, (_, t, c) => {
    const o = c.split('|');
    if (t === 'sa') return '{1:SHORTANSWER_C:' + o.map((x) => '=' + esc(x)).join('~') + '}';
    if (t === 'num') return '{1:NUMERICAL:=' + o[0] + '}';
    return '{1:MULTICHOICE_S:=' + esc(o[0]) + '~' + o.slice(1).map(esc).join('~') + '}';
  });
  preguntas.push(`<question type="cloze">
<name><text>${xml(nom)}</text></name>
<questiontext format="html">${html('<p>' + cuerpoHtml + '</p>')}</questiontext>
<generalfeedback format="html">${html('<p>' + md(explicacion) + '</p>')}</generalfeedback>
<penalty>0.3333333</penalty><hidden>0</hidden>
</question>`);
  const h = huecosMarcas(md(texto));
  diapo('Completar', '<p>' + h.pregunta + '</p>' + h.ayuda, '<p>' + h.solucion + '</p>', explicacion);
}

// Huecos con desplegable (gapselect). Los huecos son [[1]], [[2]]...
// huecos[i] = [correcta, distractor...] del hueco i+1: cada desplegable solo ofrece las opciones de su hueco.
function huecosSelect(pref, titulo, texto, codigo, huecos, explicacion) {
  const nom = nombre(pref, titulo);
  const correctas = huecos.map((h) => h[0]);
  registra(nom, codigo.replace(/\[\[(\d+)\]\]/g, (_, i) => correctas[i - 1]));
  // Las opciones 1..n son las correctas (la del hueco i es la opción i); después van los distractores.
  const todas = [
    ...huecos.map((h, i) => [h[0], i + 1]),
    ...huecos.flatMap((h, i) => h.slice(1).map((d) => [d, i + 1])),
  ];
  const ops = todas.map(([t, g]) => `<selectoption>${plain(t)}<group>${g}</group></selectoption>`).join('\n');
  preguntas.push(`${cabecera('gapselect', nom, cuerpo(texto) + pre(codigo), explicacion)}
<shuffleanswers>1</shuffleanswers>
${sinFeedback}<shownumcorrectfeedback>1</shownumcorrectfeedback>
${ops}
</question>`);
  const h = huecosArrastrar(xml(codigo), correctas, [], true);
  const ayuda = '<p class="peque">Desplegables: ' + huecos.map((x, i) => `<span class="grupo ${col(i + 1)}"><span class="chip num">${i + 1}</span> ` + barajar(x, contador + i).map((o) => '<code>' + xml(o) + '</code>').join(' · ') + '</span>').join(' &nbsp; ') + '</p>';
  diapo('Completar con desplegables', cuerpo(texto) + '<pre>' + h.pregunta.replace(/^\n|\n$/g, '') + '</pre>' + ayuda, '<pre>' + h.solucion.replace(/^\n|\n$/g, '') + '</pre>', explicacion);
}

// Arrastrar al texto (ddwtos). opciones[i] es la correcta del hueco i+1. Un hueco puede repetirse
// (misma opción en dos sitios: opción infinita). Los sobrantes son distractores.
function arrastrar(pref, titulo, texto, codigo, opciones, explicacion, { infinitas = [], grado = 1, esCodigo = true } = {}) {
  const nom = nombre(pref, titulo);
  if (esCodigo) registra(nom, codigo.replace(/\[\[(\d+)\]\]/g, (_, i) => opciones[i - 1]));
  const ops = opciones
    .map((o, i) => `<dragbox>${plain(o)}<group>1</group>${infinitas.includes(i + 1) ? '<infinite/>' : ''}</dragbox>`)
    .join('\n');
  const cuerpoTexto = esCodigo ? cuerpo(texto) + pre(codigo) : cuerpo(texto) + '<p>' + md(codigo).replace(/\n/g, '<br/>') + '</p>';
  preguntas.push(`${cabecera('ddwtos', nom, cuerpoTexto, explicacion, grado)}
<shuffleanswers>1</shuffleanswers>
${sinFeedback}<shownumcorrectfeedback>1</shownumcorrectfeedback>
${ops}
</question>`);
  const h = huecosArrastrar(esCodigo ? xml(codigo) : md(codigo).replace(/\n/g, '<br>'), opciones, infinitas);
  const marco = (x) => (esCodigo ? '<pre>' + x.replace(/^\n|\n$/g, '') + '</pre>' : '<p>' + x + '</p>');
  diapo(esCodigo ? 'Arrastrar código' : 'Ordenar', cuerpo(texto) + marco(h.pregunta) + h.ayuda, marco(h.solucion), explicacion);
}

function descripcion(titulo, texto) {
  preguntas.push(`<question type="description">
<name><text>${xml(titulo)}</text></name>
<questiontext format="html">${html(texto)}</questiontext>
<generalfeedback format="html"><text></text></generalfeedback>
<defaultgrade>0</defaultgrade><penalty>0</penalty><hidden>0</hidden>
</question>`);
}

// Registro de código mostrado en preguntas de test (para comprobar que compila).
function mostrar(nom, java) {
  registra(nom, java);
  return java;
}

// ---------- código reutilizado ----------
const CONTADOR = `class Pasos implements Runnable {
    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            System.out.println(Thread.currentThread().getName() + ": " + i);
        }
    }
}`;


// Las preguntas siguen las presentaciones (contenido/u1/*/presentacion.md) y las «Preguntas» de cada enunciado.
// Vocabulario de las diapositivas: «cerrojo» (no «candado»), «recurso compartido», «señal de fin».

// =====================================================================
// 6.1 CREAR HILOS
// =====================================================================
const A = '6.1';
categoria('Repaso PSP Unidad 1/6.1 Crear hilos');

vf(A, 'El hilo main',
  'Cuando un programa Java arranca, ya hay un hilo funcionando: se llama `main`.',
  true,
  'Verdadero. Los hilos que creas se suman a `main`.');

test(A, 'start() crea el hilo',
  'Tienes una clase `Pasos` que implementa `Runnable` y escribes `Thread h = new Thread(new Pasos(), "Hilo 1");`. ¿Qué ocurre exactamente al ejecutar `h.start();`?',
  [
    ['Java crea un hilo nuevo y llama a `run()` dentro de ese hilo.', true],
    ['Java llama a `run()` dentro del hilo `main`, como cualquier otro método.', false],
    ['El hilo `main` se queda esperando hasta que `run()` termina.', false],
    ['No pasa nada hasta que además llamas a `run()`.', false],
  ],
  '`start()` crea el hilo de verdad y Java llama a `run()` por ti. Hasta llamar a `start()` no corre nada.');

vf(A, 'run() directo no crea hilo',
  'Si en lugar de `h.start()` escribes `h.run()`, el código de `run()` se ejecuta en un hilo nuevo.',
  false,
  'Falso. `h.run()` no crea ningún hilo: ejecuta el código en el hilo `main`, como una llamada normal. Para crear el hilo, siempre `start()`.');

multi(A, 'Qué es Runnable',
  'Marca las afirmaciones **correctas** sobre `Runnable`:',
  [
    ['Es una interfaz: un contrato con un solo método, `run()`.', true],
    ['Si tu clase lo firma con `implements`, Java sabe que puede ejecutarla en un hilo.', true],
    ['El método `run()` lo escribes tú, pero no lo llamas tú: lo llama Java después de `start()`.', true],
    ['Una clase que implementa `Runnable` ya tiene su propio método `start()`.', false],
    ['Al hacer `new Pasos()` Java crea el hilo automáticamente.', false],
  ],
  'Es el contrato con un único método, `run()`. El hilo lo crea `Thread` y se arranca con `start()` sobre el `Thread`.');

test(A, 'Por qué Runnable',
  'Hay dos formas de crear un hilo: heredar de `Thread` o implementar `Runnable`. ¿Por qué usamos `Runnable`?',
  [
    ['Funciona siempre, aunque la clase ya herede de otra: Java no permite heredar de dos clases.', true],
    ['Porque con `Runnable` los hilos se ejecutan más rápido.', false],
    ['Porque heredar de `Thread` no está permitido.', false],
    ['Porque `Runnable` crea el hilo sin llamar a `start()`.', false],
  ],
  'Una clase solo puede heredar de otra, pero puede implementar `Runnable` aunque ya herede de alguien.');

numerica(A, 'Cuántos hilos hay',
  'Con este `main`, justo después de lanzar los tres hilos con `start()`, ¿cuántos hilos como máximo pueden estar ejecutándose a la vez? **Cuenta también el hilo `main`.**',
  4,
  '3 hilos contadores + el hilo `main` que sigue vivo = 4.',
  { codigo: mostrar('6.1 cuantos hilos', CONTADOR + `

class Principal {
    public static void main(String[] args) {
        Thread h1 = new Thread(new Pasos(), "Hilo 1");
        Thread h2 = new Thread(new Pasos(), "Hilo 2");
        Thread h3 = new Thread(new Pasos(), "Hilo 3");
        h1.start();
        h2.start();
        h3.start();
    }
}`) });

emparejar(A, 'Piezas de un hilo',
  'Une cada pieza con lo que hace:',
  [
    ['`run()`', 'Aquí escribes lo que hace el hilo; tú no lo llamas'],
    ['`start()`', 'Crea el hilo de verdad y Java llama a run() por ti'],
    ['`new Thread(objeto, "Hilo 1")`', 'Crea el hilo y le pone nombre, pero todavía no corre'],
    ['`Thread.currentThread()`', 'El hilo que está ejecutando esto ahora mismo'],
    ['`getName()`', 'Dime el nombre del hilo'],
  ],
  'Con la misma clase `Runnable` se pueden crear varios hilos; se distinguen por el nombre.');

arrastrar(A, 'Ordena los 4 pasos',
  'Ordena los **4 pasos** para crear un hilo con `Runnable`.',
  `1. [[1]]
2. [[2]]
3. [[3]]
4. [[4]]`,
  [
    'Escribe una clase que implemente Runnable',
    'Escribe su método run() con lo que debe hacer el hilo',
    'Crea un Thread y pásale un objeto de esa clase',
    'Llama al método start() de la clase Thread',
  ],
  'Primero la clase, luego su `run()`, después el `Thread` y por último `start()`.',
  { esCodigo: false, grado: 2 });

corta(A, 'Qué imprime run() directo',
  'Se ejecuta el programa de abajo. ¿Qué texto imprime por pantalla? (una palabra)',
  ['main'],
  'Imprime `main`: al llamar a `h.run()` no hay hilo nuevo, así que `currentThread().getName()` es el del hilo `main`.',
  { codigo: mostrar('6.1 run directo', `class Saluda implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}

class Principal {
    public static void main(String[] args) {
        Thread h = new Thread(new Saluda(), "Hilo 1");
        h.run();
    }
}`) });

completar(A, 'Escribe la clase Pasos',
  'Completa el código escribiendo (o eligiendo) lo que falta. Respeta mayúsculas y minúsculas y **no pongas paréntesis** salvo que se indique.',
  `class Pasos ⟦mc:implements|extends|import|instanceof⟧ ⟦sa:Runnable⟧ {
    ⟦sa:@Override|Override⟧
    public void ⟦sa:run⟧() {
        for (int i = 1; i <= 10; i++) {
            System.out.println(Thread.currentThread().⟦sa:getName⟧() + ": " + i);
        }
    }
}

class Principal {
    public static void main(String[] args) {
        Thread h1 = new ⟦sa:Thread⟧(new Pasos(), "Hilo 1");
        h1.⟦sa:start⟧();
    }
}`,
  '`Pasos` implementa `Runnable`, su método obligatorio es `run()`, `getName()` devuelve el nombre del hilo y `start()` lo pone en marcha.');

multi(A, 'Salidas mezcladas',
  'Este programa crea tres hilos con la misma clase `Pasos` (cada uno muestra su nombre y los números del 1 al 10) y los arranca uno tras otro. Lo ejecutas varias veces. Marca lo que es **cierto**:',
  [
    ['Las líneas de los tres hilos pueden salir mezcladas.', true],
    ['El orden de salida cambia de una ejecución a otra: el sistema decide quién avanza.', true],
    ['Siempre termina primero el «Hilo 1» porque se lanzó primero.', false],
    ['El orden de salida es siempre el mismo si lanzas los hilos en el mismo orden.', false],
  ],
  'Nadie decide quién termina antes: el orden no está garantizado. Eso es lo normal con varios hilos.',
  { codigo: mostrar('6.1 salidas mezcladas', CONTADOR + `

class Principal {
    public static void main(String[] args) {
        Thread h1 = new Thread(new Pasos(), "Hilo 1");
        Thread h2 = new Thread(new Pasos(), "Hilo 2");
        Thread h3 = new Thread(new Pasos(), "Hilo 3");
        h1.start();
        h2.start();
        h3.start();
    }
}`) });

vf(A, 'Pío siempre primero',
  'Tienes dos hilos: uno (`hPajaro`) muestra `Pío!` y otro (`hRana`) muestra `Croac!`. Los arrancas con `hPajaro.start();` y justo después `hRana.start();`. Entonces `Pío!` siempre sale antes que `Croac!`.',
  false,
  'Falso. Se lanzan en orden, pero no tienen por qué terminar en orden. Ejecútalo varias veces y cambia.');

completarTexto(A, 'Posiciones de un array',
  'Con `Thread[] pajaros = new Thread[5];` el array tiene ⟦num:5⟧ cajas. La primera es `pajaros[⟦num:0⟧]` y la última es `pajaros[⟦num:4⟧]`.',
  'Se empieza a contar en 0, no en 1. Un array de 5 tiene posiciones del 0 al 4.');

test(A, 'for con <= 5',
  'La clase `Pajaro` implementa `Runnable`. El array `pajaros` tiene 5 posiciones. ¿Qué ocurre con este `for`?',
  [
    ['En la sexta vuelta, `pajaros[5]` no existe y Java lanza `ArrayIndexOutOfBoundsException`.', true],
    ['Funciona bien: da 5 vueltas.', false],
    ['No compila.', false],
    ['Crea un hilo de más sin ningún error.', false],
  ],
  '`i <= 5` da 6 vueltas (0, 1, 2, 3, 4, 5). Un array de 5 tiene posiciones del 0 al 4.',
  { codigo: `Thread[] pajaros = new Thread[5];

for (int i = 0; i <= 5; i++) {
    pajaros[i] = new Thread(new Pajaro(), "Pajaro " + (i + 1));
    pajaros[i].start();
}` });

huecosSelect(A, 'El for de los pájaros',
  'Completa con los desplegables el `for` que crea y lanza los 5 hilos Pajaro. El primer pájaro debe llamarse «Pajaro 1».',
  `class Pajaro implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": Pío!");
    }
}

class Principal {
    public static void main(String[] args) {
        Thread[] pajaros = new Thread[5];

        for (int i = [[1]]; i [[2]] 5; i++) {
            pajaros[i] = new Thread(new Pajaro(), "Pajaro " + (i + [[3]]));
            pajaros[i].start();
        }
    }
}`,
  [['0', '1'], ['<', '<='], ['1', '0']],
  '`i` empieza en 0 (primera caja), sigue mientras `i < 5` y al nombre se le suma 1 para que el primero sea «Pajaro 1».');

test(A, 'Cómo entra el array',
  'Quieres que un hilo calcule el total de un array de enteros con precios. El método `run()` no tiene parámetros. ¿Cómo recibe el hilo el array?',
  [
    ['Por el constructor de la clase del hilo: la clase lo guarda en un atributo y `run()` lo usa después.', true],
    ['Como parámetro de `run(int[] precios)`.', false],
    ['Como parámetro de `start()`.', false],
    ['Java se lo pasa solo al crear el hilo.', false],
  ],
  'Orden: `new HiloTotal(precios)` guarda el array; más tarde `start()` llama a `run()`, que lo usa.');

completar(A, 'HiloTotal',
  'Un hilo debe sumar los precios de un array de enteros que recibe por el constructor. Completa la clase `HiloTotal`. Respeta mayúsculas y minúsculas.',
  `class HiloTotal implements Runnable {
    private int[] precios;

    public HiloTotal(int[] precios) {
        this.⟦sa:precios⟧ = precios;
    }

    @Override
    public void run() {
        int total = ⟦num:0⟧;
        for (int i = 0; i < precios.⟦sa:length⟧; i++) {
            total = total + precios[i];
        }
        System.out.println(Thread.currentThread().getName() + ": total = " + total);
    }
}`,
  '`this.precios` es la caja de la clase; `precios` a secas es lo que llega. `length` dice cuántos elementos tiene el array. La suma empieza en 0 porque sumar 0 no cambia nada.');

completarTexto(A, 'Valores iniciales y resultados',
  'Tres hilos recorren el mismo array {1, 2, ..., 10}: uno **cuenta los pares**, otro **multiplica** todos los elementos y otro busca el **menor**. El contador de pares empieza en ⟦num:0⟧ y da ⟦num:5⟧. La multiplicación empieza en ⟦num:1⟧ y da ⟦num:3628800⟧. La búsqueda del menor empieza con el elemento `precios[⟦num:0⟧]`, su `for` empieza en `i = ⟦num:1⟧` y da ⟦num:1⟧.',
  'El contador empieza en 0 (aún no ha contado nada). La multiplicación empieza en 1 (con 0 todo daría 0). El menor empieza con el primer elemento del array, no con un número inventado.');

vf(A, 'Tres hilos, un array',
  'Tres hilos reciben el **mismo** array de enteros: uno cuenta los pares, otro multiplica los elementos y otro busca el menor. Los tres solo **leen** el array; ninguno lo modifica. Entonces no hay ningún problema de sincronización.',
  true,
  'Verdadero. Leer a la vez no estropea nada; el problema aparece cuando alguien **modifica** el dato compartido (6.3).');

test(A, 'switch y break',
  '¿Qué hace `break` dentro de un `switch`?',
  [
    ['Evita seguir con el `case` siguiente.', true],
    ['Detiene el programa entero.', false],
    ['Salta al primer `case`.', false],
    ['Detiene el hilo que lo ejecuta.', false],
  ],
  '`switch` mira el valor y salta al `case` que coincide. `break` evita seguir con el siguiente.');

completar(A, 'HiloMaximo',
  'Completa el hilo que calcula la temperatura máxima registrada en un día. Respeta mayúsculas y minúsculas.',
  `class HiloMaximo implements Runnable {
    private int[] temperaturas;

    public HiloMaximo(int[] temperaturas) {
        this.temperaturas = temperaturas;
    }

    @Override
    public void run() {
        int maximo = temperaturas[⟦num:0⟧];
        for (int i = 1; i < temperaturas.length; i++) {
            ⟦mc:if|while|for|switch⟧ (temperaturas[i] > maximo) {
                maximo = ⟦sa:temperaturas[i]⟧;
            }
        }
        System.out.println(Thread.currentThread().getName() + ": máximo = " + maximo);
    }
}`,
  'El máximo provisional es la primera temperatura. El `for` empieza en 1 porque la posición 0 ya está guardada. Si la temperatura es mayor, pasa a ser el máximo.');

test(A, 'Mínimo empezando en 0',
  'Un hilo calcula la temperatura **mínima** de un array `temperaturas` con valores entre 12 y 30 grados. ¿Qué pasa si `minimo` empieza en `0` en lugar de `temperaturas[0]`?',
  [
    ['Siempre saldría 0, porque ninguna temperatura es menor que 0.', true],
    ['Funciona igual de bien.', false],
    ['Siempre saldría 30.', false],
    ['Java lanza una excepción.', false],
  ],
  'Máximo y mínimo empiezan siempre en **un valor del array**, no en un número inventado.',
  { codigo: `int minimo = 0;
for (int i = 1; i < temperaturas.length; i++) {
    if (temperaturas[i] < minimo) {
        minimo = temperaturas[i];
    }
}` });

completarTexto(A, 'Media con int y con double',
  'Las 8 temperaturas suman 180. Con `int`, la división 180 / 8 da ⟦num:22⟧ (se descartan los decimales). Con `double` da ⟦num:22.5⟧.',
  'La división entre enteros descarta los decimales. Por eso el total de la media es `double`.');

redaccion(A, 'Programa tus hilos',
  'Escribe el código completo (dos clases) de un programa que lance **2 hilos** llamados «Alfa» y «Beta». Cada hilo debe mostrar 4 veces `Soy <nombre del hilo>`. Usa `Runnable` y la clase `Principal`.',
  `public class Eco implements Runnable {
    @Override
    public void run() {
        for (int i = 1; i <= 4; i++) {
            System.out.println("Soy " + Thread.currentThread().getName());
        }
    }
}

public class Principal {
    public static void main(String[] args) {
        Thread h1 = new Thread(new Eco(), "Alfa");
        Thread h2 = new Thread(new Eco(), "Beta");
        h1.start();
        h2.start();
    }
}`, '', { grado: 5 });

// =====================================================================
// 6.2 PRIORIDADES
// =====================================================================
const B = '6.2';
categoria('Repaso PSP Unidad 1/6.2 Prioridades');

completarTexto(B, 'Valores de prioridad',
  '`Thread.MIN_PRIORITY` vale ⟦num:1⟧, `Thread.NORM_PRIORITY` vale ⟦num:5⟧ y `Thread.MAX_PRIORITY` vale ⟦num:10⟧.',
  'Las prioridades van del 1 al 10 y la normal es 5.');

emparejar(B, 'Constante y valor',
  'Une cada constante con su valor:',
  [
    ['`Thread.MIN_PRIORITY`', '1'],
    ['`Thread.NORM_PRIORITY`', '5'],
    ['`Thread.MAX_PRIORITY`', '10'],
  ],
  'Mínima 1, normal 5, máxima 10.');

test(B, 'Qué es el planificador',
  '¿Qué es el **planificador**?',
  [
    ['La parte del sistema que decide qué hilo usa el núcleo en cada momento.', true],
    ['Una clase de Java que crea los hilos.', false],
    ['El método que pone en marcha un hilo.', false],
    ['El hilo `main`.', false],
  ],
  'Con muchos hilos y pocos núcleos, el planificador decide quién se ejecuta. La prioridad es un consejo para esa decisión.');

test(B, 'Prioridad por defecto',
  'Creas un hilo desde `main` y **no** llamas a `setPriority`. ¿Qué prioridad tiene?',
  [
    ['5: la hereda del hilo que lo crea (`main`).', true],
    ['1: los hilos nuevos empiezan con la mínima.', false],
    ['10: los hilos nuevos empiezan con la máxima.', false],
    ['0: no tiene prioridad hasta que se arranca.', false],
  ],
  'Un hilo nuevo hereda la prioridad del hilo que lo crea. Como `main` tiene 5, los hilos nacen con 5.');

vf(B, 'setPriority antes de start',
  'La prioridad se cambia con `setPriority(...)` **antes** de llamar a `start()`.',
  true,
  'Verdadero. Primero se fija la prioridad y después se arranca el hilo.');

test(B, 'Qué hace yield',
  '¿Qué hace `Thread.yield()`?',
  [
    ['El hilo ofrece su turno al planificador. Es solo una sugerencia.', true],
    ['Detiene el hilo durante un segundo.', false],
    ['Espera a que otro hilo termine.', false],
    ['Baja la prioridad del hilo a 1.', false],
  ],
  '`yield()` es solo una sugerencia: Java puede ignorarla.');

vf(B, 'Prioridad 10 gana siempre',
  'Un hilo con prioridad 10 siempre termina antes que un hilo con prioridad 1.',
  false,
  'Falso. Los hilos de prioridad 10 no siempre terminan los primeros; a veces ni siquiera terminan antes que los de prioridad 1.');

multi(B, 'Por qué no garantiza el orden',
  'Marca las razones **correctas** por las que la prioridad no garantiza el orden:',
  [
    ['Java no gestiona las prioridades: se las pasa al sistema operativo.', true],
    ['Cada sistema las trata a su manera y algunos casi las ignoran.', true],
    ['Con varios núcleos todos los hilos avanzan a la vez y la prioridad pesa poco.', true],
    ['Los hilos de prioridad 1 nunca llegan a ejecutarse.', false],
    ['Java las ignora siempre y las deja en 5.', false],
  ],
  'La prioridad es un consejo, no una orden.');

test(B, 'Obligar a un orden',
  'Quieres que un hilo termine **antes** que otro. ¿Qué usas?',
  [
    ['`join()` o `wait()`/`notify()`, no las prioridades.', true],
    ['Dar prioridad 10 al que debe terminar antes.', false],
    ['`Thread.yield()` en los dos hilos.', false],
    ['Dar prioridad 1 al otro.', false],
  ],
  'Para obligar a un orden no se usan prioridades: se usa `join()` o `wait()`/`notify()`.');

huecosSelect(B, 'Cambiar y leer la prioridad',
  'Completa el código con los desplegables: el hilo debe tener la prioridad máxima y luego se muestra su prioridad.',
  `class Tarea implements Runnable {
    @Override
    public void run() {
    }
}

class Principal {
    public static void main(String[] args) {
        Thread h = new Thread(new Tarea(), "Rápido");
        h.[[1]]([[2]]);
        h.start();
        System.out.println(h.[[3]]());
    }
}`,
  [['setPriority', 'setName'], ['Thread.MAX_PRIORITY', 'Thread.MAX_VALUE'], ['getPriority', 'getName']],
  '`setPriority(Thread.MAX_PRIORITY)` fija la prioridad en 10 y `getPriority()` la devuelve.');

numerica(B, 'Cuántos hilos se crean',
  'Este programa crea hilos en un bucle: en cada vuelta, un hilo con prioridad mínima, uno normal y uno máxima. ¿Cuántos hilos se crean **sin contar `main`**?',
  15,
  '5 vueltas × 3 hilos por vuelta = 15.',
  { codigo: mostrar('6.2 cuantos hilos se crean', `class Tarea implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " termina");
    }
}

class Principal {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 0; i < n; i++) {
            Thread minimo = new Thread(new Tarea(), "Mínimo " + (i + 1));
            Thread normal = new Thread(new Tarea(), "Normal " + (i + 1));
            Thread maximo = new Thread(new Tarea(), "Máximo " + (i + 1));
            minimo.setPriority(Thread.MIN_PRIORITY);
            maximo.setPriority(Thread.MAX_PRIORITY);
            minimo.start();
            normal.start();
            maximo.start();
        }
    }
}`) });

// =====================================================================
// 6.3 INFORMACIÓN COMPARTIDA
// =====================================================================
const C = '6.3';
categoria('Repaso PSP Unidad 1/6.3 Información compartida');

test(C, 'Recurso compartido',
  '¿Qué es un **recurso compartido**?',
  [
    ['Un objeto o dato que usan varios hilos a la vez.', true],
    ['Una clase que implementa `Runnable`.', false],
    ['Un hilo que ejecuta código de otro.', false],
    ['Un método con `synchronized`.', false],
  ],
  'Ejemplos: una cuenta bancaria, un fichero, una impresora, un contador...');

test(C, 'Cómo se comparte en Java',
  '¿Cómo se comparte un recurso entre varios hilos en Java?',
  [
    ['Se crea **un solo objeto** y se pasa la misma referencia a cada hilo, normalmente por el constructor.', true],
    ['Cada hilo crea su propio objeto con `new`.', false],
    ['Se declara el objeto como `private` en cada hilo.', false],
    ['Java comparte automáticamente todos los objetos entre los hilos.', false],
  ],
  'Si cada hilo tuviera su objeto, ya no se compartiría nada.');

test(C, 'Condición de carrera',
  '¿Qué es una **condición de carrera**?',
  [
    ['Varios hilos leen y cambian el mismo dato y el resultado depende de quién llega antes.', true],
    ['Una competición entre hilos para ver cuál termina antes, que es lo que se busca.', false],
    ['Un error de compilación por tener dos hilos en la misma clase.', false],
    ['La prioridad más alta que puede tener un hilo.', false],
  ],
  'Lo peor: el programa no da error. A veces sale bien y a veces mal, y no se puede predecir.');

arrastrar(C, 'Sumar 1 son tres pasos',
  'Aunque `puntos++` se escribe en una línea, para el ordenador son tres pasos. Ordénalos.',
  `1. [[1]]
2. [[2]]
3. [[3]]`,
  ['Leer los puntos', 'Calcular el nuevo valor', 'Guardar los puntos'],
  'Otro hilo puede colarse entre dos pasos: ahí se produce la condición de carrera.',
  { esCodigo: false });

completarTexto(C, 'Traza de una carrera',
  'Una variable compartida `puntos` vale 40. Dos hilos ejecutan a la vez `puntos++`, que son tres pasos: leer, calcular y guardar. Ocurre este orden: A lee 40, B lee 40, A guarda 41 y B guarda 41. Se han ejecutado ⟦num:2⟧ incrementos, pero `puntos` vale ⟦num:41⟧. Debería valer ⟦num:42⟧.',
  'B guarda el mismo resultado que A: uno de los dos incrementos **se pierde**.');

vf(C, 'Si hoy sale bien',
  'Un programa tiene 800 hilos que comparten una variable `puntos` que empieza en 50: 400 hilos le suman 1 y 400 hilos le restan 1, **sin sincronizar**. Hoy, al ejecutarlo, el valor final es 50. Entonces el programa es correcto.',
  false,
  'Falso. Con una condición de carrera a veces sale bien y a veces mal. Que hoy salga bien no demuestra nada.');

completarTexto(C, 'Los hilos y el valor final',
  'Una variable compartida empieza en 50. Se lanzan 400 hilos que le suman 1 y 400 hilos que le restan 1. En total hay ⟦num:800⟧ hilos y, si todo funciona bien, el valor final es ⟦num:50⟧.',
  '400 + 400 = 800 hilos; 50 + 400 − 400 = 50.');

completar(C, 'Recurso sincronizado',
  'Una clase guarda el marcador de un partido que usan muchos hilos a la vez. Completa la clase para que los dos métodos sean seguros entre hilos.',
  `class Marcador {
    private int puntos = 0;

    public ⟦mc:synchronized|static|final|abstract⟧ void sumarPunto() {
        puntos++;
    }

    public ⟦mc:synchronized|static|final|abstract⟧ void quitarPunto() {
        puntos--;
    }
}`,
  '`synchronized` en la cabecera del método: solo deja entrar a un hilo a la vez; los demás esperan fuera.');

test(C, 'Qué es el cerrojo',
  '¿Qué es el **cerrojo** de un objeto?',
  [
    ['Cada objeto tiene uno: el hilo que entra en un método `synchronized` lo coge y lo suelta al salir.', true],
    ['Un método que bloquea el programa para siempre.', false],
    ['Una palabra reservada que se escribe en la cabecera del método.', false],
    ['Un tipo especial de hilo.', false],
  ],
  'Es como una puerta de una sola persona: el que está dentro lee, calcula y guarda sin que nadie se cuele.');

vf(C, 'Dos objetos, dos cerrojos',
  'La clase `Marcador` tiene un método `synchronized void sumarPunto()`. Dos hilos usan dos objetos `Marcador` **distintos** (cada hilo con el suyo). Entonces uno puede estar dentro de `sumarPunto()` mientras el otro también lo está en su objeto.',
  true,
  'Verdadero. Cada objeto tiene su cerrojo. Para que se excluyan, los hilos deben compartir **el mismo objeto**.');

test(C, 'Synchronized en los dos métodos',
  'Una clase tiene un marcador con dos métodos: `sumarPunto()` (hace `puntos++`) y `quitarPunto()` (hace `puntos--`). Muchos hilos los usan a la vez. ¿Por qué hay que poner `synchronized` en **los dos**?',
  [
    ['Porque los dos tocan la misma variable: si solo uno estuviera sincronizado, el otro podría colarse entre sus tres pasos.', true],
    ['Porque Java obliga a que todos los métodos de una clase sean `synchronized`.', false],
    ['Porque si no, `quitarPunto()` no compila.', false],
    ['Porque así el método va más rápido.', false],
  ],
  'Quien suma y quien quita modifican la misma variable: los dos métodos deben usar el mismo cerrojo.');

test(C, 'Dónde va synchronized',
  'Un programa tiene dos clases de hilos, `Anotador` y `Penalizador` (`Runnable`), que comparten un objeto `Marcador` y modifican su variable `puntos`. Para evitar la condición de carrera, ¿qué hay que cambiar?',
  [
    ['Solo la clase `Marcador`: sus métodos pasan a ser `synchronized`.', true],
    ['El método `run()` de cada hilo.', false],
    ['El método `main`.', false],
    ['Hay que reescribir las tres clases.', false],
  ],
  'Se protege el dato compartido, no a los hilos.');

test(C, 'Qué se pierde al sincronizar',
  '¿Qué se pierde a cambio de que el resultado sea correcto al sincronizar?',
  [
    ['Los hilos pasan de uno en uno por esos métodos: se pierde trabajar a la vez dentro de ellos.', true],
    ['Se pierde el nombre de los hilos.', false],
    ['No se pierde nada.', false],
    ['Se pierde la prioridad de los hilos.', false],
  ],
  'Sincronizar da un resultado correcto, pero quita la ventaja de hacer varias cosas a la vez.');

test(C, 'Sale el valor esperado sin synchronized',
  'Cinco hilos suman 1 a un contador de visitas compartido, 30 veces cada uno (el valor correcto es 150). Quitas `synchronized` del método que suma y en una ejecución sale 150. ¿Significa que no hace falta?',
  [
    ['No: la condición de carrera es impredecible; que salga 150 hoy no demuestra que sea seguro.', true],
    ['Sí: si sale 150, el programa es correcto.', false],
    ['Sí, porque 150 es el valor correcto.', false],
    ['No, porque sin `synchronized` el programa no compila.', false],
  ],
  'Con varios hilos puede salir 150 y fallar en otra ejecución o en otro ordenador.');

numerica(C, 'Valor final con synchronized',
  'Cinco hilos suman 1 a un contador de visitas compartido que empieza en 0, 30 veces cada uno. El método que suma es `synchronized`. ¿Qué valor tiene el contador al terminar?',
  150,
  '5 × 30 = 150, y con `synchronized` sale siempre.');

completarTexto(C, 'Taller y sleep',
  'Un taller tiene 4 llaves inglesas compartidas y 4 mecánicos (hilos). Cada mecánico repite 3 veces: toma una llave con el método `tomar()` (que es `synchronized`), trabaja durante 2 segundos y la deja. En total se llama a `tomar()` ⟦num:12⟧ veces. Si el `sleep(2000)` está **dentro** de `tomar()`, el programa tarda unos ⟦num:24⟧ segundos. Si el `sleep` está **fuera**, en el hilo del mecánico, tarda unos ⟦num:6⟧.',
  '12 × 2 = 24 s si van de uno en uno; 3 vueltas × 2 s = 6 s si trabajan a la vez.');

test(C, 'sleep dentro de synchronized',
  'Un taller tiene 4 llaves inglesas y 4 mecánicos (hilos). Cada mecánico llama a un método `synchronized tomar()` que descuenta una llave y después **duerme 2 segundos dentro del propio método**. Aunque quedan llaves libres, los mecánicos van de uno en uno. ¿Por qué?',
  [
    ['Porque el mecánico duerme **dentro** de un método `synchronized`: tiene el cerrojo y los demás no pueden ni entrar.', true],
    ['Porque `sleep` bloquea todos los hilos del programa.', false],
    ['Porque `tomar()` es más lento que `dejar()`.', false],
    ['Porque solo hay una llave buena.', false],
  ],
  'Regla: el `sleep` va **fuera** de `synchronized`.');

test(C, 'Error cannot find symbol',
  'Escribes `sleep(3000);` y NetBeans marca `cannot find symbol`. ¿Qué arregla ese error?',
  [
    ['Un `import static java.lang.Thread.sleep;` arriba del fichero (la bombilla lo escribe).', true],
    ['Escribir `try` y `catch`.', false],
    ['Declarar `throws InterruptedException` en `run()`.', false],
    ['Cambiar `sleep` por `wait`.', false],
  ],
  'Hay dos errores distintos: `cannot find symbol` (falta el import) e `InterruptedException` (falta el `try/catch`).');

test(C, 'InterruptedException en run()',
  '`sleep(3000)` obliga a tratar la `InterruptedException`. En `run()` de un `Runnable`, ¿cuál es la opción correcta de la bombilla?',
  [
    ['**Surround Statement with try-catch**.', true],
    ['**Add throws clause**: el método `run()` declara `throws InterruptedException`.', false],
    ['Borrar el `sleep`.', false],
    ['Cambiar `run()` por `start()`.', false],
  ],
  'El método `run()` de un `Runnable` no puede declarar esa excepción: hay que usar `try/catch`.');

huecosSelect(C, 'Pausa con sleep',
  'Elige en cada desplegable la palabra que falta para pausar el hilo 1 segundo.',
  `class Pausa implements Runnable {
    @Override
    public void run() {
        [[1]] {
            Thread.[[2]](1000);
        } [[3]] (InterruptedException e) {
        }
    }
}`,
  [['try', 'throw'], ['sleep', 'wait'], ['catch', 'finally']],
  '`sleep` puede lanzar `InterruptedException` si despiertan al hilo mientras duerme, así que va dentro de un `try` con su `catch`.');

completarTexto(C, 'Taller sin wait',
  'Un taller tiene 4 llaves. Su método `tomar()` resta 1 a `libres` **sin comprobar** si queda alguna, y 6 mecánicos lo llaman sin dejar ninguna llave. El mecánico 5 muestra «Libres: ⟦num:-1⟧» y el mecánico 6 muestra «Libres: ⟦num:-2⟧».',
  '`tomar()` resta 1 sin mirar si queda alguna: toma llaves que no existen.');

test(C, 'wait suelta el cerrojo',
  'Un hilo está dentro de un método `synchronized tomar()` y espera con `wait()` porque no quedan llaves. Otro hilo tiene que entrar en el método `synchronized dejar()` para avisarle. ¿Por qué `wait()` **suelta el cerrojo** mientras espera?',
  [
    ['Si no lo soltara, nadie podría entrar en `dejar()` y el hilo esperaría para siempre.', true],
    ['Para que el hilo se despierte antes.', false],
    ['Porque `wait()` termina el programa.', false],
    ['No lo suelta: sigue con el cerrojo mientras espera.', false],
  ],
  'Al soltar el cerrojo, otro hilo puede entrar en el método `synchronized` y avisar.');

test(C, 'Dónde se usan wait y notifyAll',
  '¿Dónde se pueden usar `wait()` y `notifyAll()`?',
  [
    ['Solo dentro de un método `synchronized`.', true],
    ['En cualquier método de cualquier clase.', false],
    ['Solo en `main`.', false],
    ['Solo en métodos `static`.', false],
  ],
  'Todas las clases los tienen. Se escribe `wait()` a secas, sin nada delante, y siempre dentro de código `synchronized`.');

arrastrar(C, 'Parking: arrastra las palabras',
  'Arrastra las palabras a los huecos para que el parking espere cuando no haya plazas y avise cuando se libere una. Algunas palabras sobran.',
  `class Parking {
    private int libres = 3;

    public [[1]] void entrar() {
        [[2]] (libres == 0) {
            try {
                [[3]]();
            } catch (InterruptedException ex) {
            }
        }
        libres--;
    }

    public [[1]] void salir() {
        libres++;
        [[4]]();
    }
}`,
  ['synchronized', 'while', 'wait', 'notifyAll', 'if', 'sleep', 'join'],
  'Los dos métodos son `synchronized`; `entrar()` espera con `while` + `wait()` y `salir()` avisa con `notifyAll()`.',
  { infinitas: [1], grado: 3 });

test(C, 'Por qué while y no if',
  'Varios hilos esperan con `wait()` dentro de un método `synchronized` porque no queda ningún recurso libre. Otro hilo libera **un** recurso y llama a `notifyAll()`: se despiertan todos. ¿Por qué la espera se escribe con `while` y no con `if`?',
  [
    ['Con `while`, cada hilo que se despierta comprueba otra vez si queda un recurso antes de cogerlo.', true],
    ['Porque `if` no se puede combinar con `wait()`.', false],
    ['Porque `while` hace que el hilo espere más tiempo.', false],
    ['Es solo cuestión de estilo: da igual uno que otro.', false],
  ],
  'Con `if`, todos pasarían a coger el recurso sin volver a mirar y el contador quedaría negativo. Regla: `wait()` siempre dentro de un `while` que repite la condición.');

test(C, 'Parking sin notifyAll',
  'Un parking tiene un método `synchronized entrar()` (si no hay plazas libres, el coche espera con `while` + `wait()`) y un método `synchronized salir()` (suma una plaza libre). Si `salir()` **no** llama a `notifyAll()`, ¿qué pasa?',
  [
    ['Los coches que esperan nunca se enteran de que hay plaza y se quedan colgados.', true],
    ['Nada: los coches vuelven a mirar solos cada segundo.', false],
    ['Las plazas libres salen negativas.', false],
    ['El programa no compila.', false],
  ],
  '`wait()` duerme hasta que lo avisen. Sin `notifyAll()` nadie despierta a los que esperan.');

arrastrar(C, 'Ordena el método tomar()',
  'Un taller comparte un contador de llaves libres entre varios mecánicos. Ordena las líneas del método `tomar()`. Reglas: primero esperar mientras no haya llaves; después tomar una y por último mostrar el mensaje.',
  `class Taller {
    private int libres = 4;

    public synchronized void tomar() throws InterruptedException {
        [[1]]
            [[2]]
        [[3]]
        [[4]]
        [[5]]
    }
}`,
  ['while (libres == 0) {', 'wait();', '}', 'libres--;', 'System.out.println("toma una llave");'],
  'Se espera con `while` + `wait()`, se cierra el bucle y solo entonces se toma la llave.',
  { grado: 2 });

redaccion(C, 'Escribe tu propio recurso',
  'Escribe la clase `Taquilla`: empieza con 5 entradas disponibles. El método `comprar()` debe **esperar** si no quedan entradas y restar una cuando ya hay. El método `devolver()` suma una entrada y **avisa** a los que esperan. Debe ser seguro entre hilos.',
  `public class Taquilla {
    private int entradas = 5;

    public synchronized void comprar() {
        while (entradas == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        entradas--;
    }

    public synchronized void devolver() {
        entradas++;
        notifyAll();
    }
}`, '', { grado: 5 });

// =====================================================================
// 6.4 COMUNICAR HILOS
// =====================================================================
const D = '6.4';
categoria('Repaso PSP Unidad 1/6.4 Comunicar hilos');

emparejar(D, 'wait, notify y compañía',
  'Une cada elemento con su función:',
  [
    ['`wait()`', 'El hilo se duerme hasta que lo avisen y suelta el cerrojo'],
    ['`notify()`', 'Despierta a uno de los hilos que esperan'],
    ['`notifyAll()`', 'Despierta a todos los hilos que esperan'],
    ['`synchronized`', 'Solo deja entrar a un hilo a la vez'],
  ],
  '`notify()` despierta a uno; `notifyAll()`, a todos. Los dos son métodos de la clase `Object`.');

multi(D, 'Los dos papeles',
  'Un granjero (hilo) deja sacos en un cobertizo donde caben **3 sacos** (el cobertizo guarda cuántos hay, `numSacos`, y cuántos caben, `numMaxSacos`), y un repartidor (hilo) los saca para repartirlos. El cobertizo es un objeto compartido con métodos `synchronized`. Marca lo que es **correcto**:',
  [
    ['El granjero espera si el cobertizo está lleno.', true],
    ['El repartidor espera si el cobertizo está vacío.', true],
    ['Cuando uno termina, avisa al otro con `notify()`.', true],
    ['Solo el granjero necesita esperar; el repartidor nunca espera.', false],
    ['Cada hilo debe tener su propio cobertizo.', false],
  ],
  'Cada hilo tiene un papel distinto: uno espera a que el otro haga algo. Se crea **un solo** cobertizo; si cada hilo tuviera el suyo, no se comunicarían.');

test(D, 'notify con 2 hilos',
  'Un granjero y **un** repartidor comparten un cobertizo de capacidad 1 y con ellos basta `notify()`. ¿Y si hubiera un granjero y **dos** repartidores?',
  [
    ['Hay tres hilos que pueden esperar: `notify()` despierta a uno cualquiera y puede ser el equivocado; hace falta `notifyAll()`.', true],
    ['Sigue valiendo `notify()` igual.', false],
    ['No se puede usar `notify()` nunca.', false],
    ['Hay que usar `sleep()` en lugar de avisar.', false],
  ],
  'Si despierta al que no puede avanzar, el granjero se queda dormido para siempre. Con `notify()` a veces funciona y a veces se cuelga.');

vf(D, 'notify elige al más antiguo',
  '`notify()` despierta siempre al hilo que lleva más tiempo esperando.',
  false,
  'Falso. Despierta a uno cualquiera de los que esperan.');

test(D, 'Qué es la señal de fin',
  'Varios repartidores sacan sacos de un cobertizo compartido y un granjero los va dejando, pero los repartidores **no saben cuántos sacos** les tocan. ¿Cómo saben que ya no habrá más?',
  [
    ['El cobertizo cuenta los sacos preparados y los repartidos (datos compartidos), y los repartidores paran cuando ya se ha preparado todo y no queda ninguno.', true],
    ['Cada repartidor cuenta hasta 12 por su cuenta.', false],
    ['Java termina los hilos repartidores automáticamente.', false],
    ['Esperan 20 segundos y salen.', false],
  ],
  'La señal de fin es un dato compartido (aquí, los contadores del cobertizo) que permite a los que esperan saber que ya no habrá más.');

test(D, 'Repartir sin mirar los preparados',
  'Los repartidores esperan con `while (numSacos == 0) wait();`, sin mirar `numSacosPreparados`. El granjero prepara sus 12 sacos y se marcha, los repartidores reparten todos los sacos que hay, pero uno de ellos llega a `repartir()` cuando el cobertizo ya está vacío. ¿Qué ocurre?',
  [
    ['Ese repartidor se queda esperando para siempre y el programa no termina.', true],
    ['Ese repartidor se marcha solo al ver que no hay sacos.', false],
    ['Java lanza una excepción en el granjero.', false],
    ['El programa termina normalmente.', false],
  ],
  'Nadie va a avisar a ese repartidor: el granjero ya terminó. Por eso el `while` también mira si faltan sacos por preparar (`numSacosPreparados < 12`), y así el repartidor sale del `wait()` cuando ya no habrá más.');

test(D, 'Preparados antes que sacos',
  'En `repartir()`, después del `while`, un programador comprueba **primero** si ya se han preparado los 12 sacos y, si es así, el repartidor se marcha sin repartir; solo **después** mira si hay sacos. ¿Qué problema puede ocurrir?',
  [
    ['Se pierden los sacos que quedan en el cobertizo: el granjero termina y los repartidores se van sin repartirlos.', true],
    ['Se reparten dos sacos a la vez.', false],
    ['No pasa nada: da igual el orden.', false],
    ['El programa no compila.', false],
  ],
  'Hay que mirar primero si hay sacos (`numSacos > 0`): si el granjero termina con sacos en el cobertizo, esos sacos se reparten igualmente.');

completar(D, 'Cobertizo: repartir()',
  'Un cobertizo de sacos lo comparten un granjero y varios repartidores. Completa `repartir()`: los repartidores esperan mientras **no haya sacos y todavía falten sacos por preparar** (el granjero prepara 12).',
  `class Cobertizo {
    private int numSacos = 0;
    private int numSacosPreparados = 0;
    private int numSacosRepartidos = 0;

    public synchronized void repartir() {
        while (⟦mc:numSacos == 0|numSacos > 0|numSacosPreparados == 0⟧ && ⟦mc:numSacosPreparados < 12|numSacosPreparados > 12|numSacosRepartidos < 12⟧) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        if (⟦mc:numSacos > 0|numSacos == 0|numSacosPreparados < 12⟧) {
            numSacos--;
            ⟦mc:numSacosRepartidos++|numSacosPreparados++|numSacosRepartidos--⟧;
            ⟦sa:notifyAll⟧();
        }
    }
}`,
  'Esperan si no hay sacos **y** todavía faltan por preparar. Al salir del `while`, si hay sacos se reparte uno, se cuenta como repartido y se avisa con `notifyAll()`; si no, es que ya se prepararon todos y el repartidor se va.');

arrastrar(D, 'Ordena dejar()',
  'Ordena las líneas de `dejar()`. Reglas: primero esperar si el cobertizo está lleno; después actualizar el estado; luego escribir el mensaje y **por último** avisar a los demás.',
  `class Cobertizo {
    private int numSacos = 0;
    private int numMaxSacos = 1;

    public synchronized void dejar(int numero) throws InterruptedException {
        [[1]]
            [[2]]
        [[3]]
        [[4]]
        [[5]]
        [[6]]
    }
}`,
  ['while (numSacos == numMaxSacos) {', 'wait();', '}', 'numSacos++;', 'System.out.println("deja el saco " + numero);', 'notifyAll();'],
  'Esperar, cambiar el estado, mostrar y avisar.',
  { grado: 3 });

arrastrar(D, 'Ordena el aviso',
  'Ordena los pasos de lo que ocurre cuando un hilo A espera algo que otro hilo B va a proporcionar.',
  `1. [[1]]
2. [[2]]
3. [[3]]
4. [[4]]
5. [[5]]
6. [[6]]`,
  [
    'A entra en un método synchronized y comprueba la condición',
    'No se cumple: A llama a wait() y suelta el cerrojo',
    'B entra en el método y cambia el estado',
    'B llama a notifyAll()',
    'A se despierta y vuelve a comprobar la condición en el while',
    'Ahora se cumple: A sigue ejecutando',
  ],
  'Es el ciclo completo del patrón `while + wait` / cambiar estado + `notifyAll`.',
  { esCodigo: false, grado: 2 });

vf(D, 'Salida con un granjero y un repartidor',
  'Un granjero deja 12 sacos en un cobertizo donde caben 3 (`new Cobertizo(3)`) y un repartidor los reparte. Los mensajes («deja el saco 1», «reparte el saco 1», «deja el saco 2»...) salen **siempre en el mismo orden** en todas las ejecuciones.',
  false,
  'Falso. Los sacos salen del 1 al 12 y el cobertizo nunca pasa de 3 ni baja de 0, pero el granjero puede dejar hasta 3 antes de que el repartidor reparta, y el orden de los mensajes cambia de una ejecución a otra.');

multi(D, 'Salida con un granjero y dos repartidores',
  'Un granjero deja 12 sacos en un cobertizo de capacidad 3 y **dos** repartidores compiten por repartirlos (cada saco lo reparte uno solo). Marca lo que es **cierto**:',
  [
    ['Cada saco del 1 al 12 se reparte una sola vez.', true],
    ['Quién reparte cada saco cambia entre ejecuciones.', true],
    ['A veces un solo repartidor reparte todos y también es correcto.', true],
    ['Los dos repartidores reparten siempre 5 sacos cada uno.', false],
    ['El mismo saco se reparte dos veces.', false],
  ],
  'Se reparten los sacos sin que se sepa cuántos reparte cada uno.');

completarTexto(D, 'Cuántos sacos',
  'El granjero prepara 10 sacos y hay 2 repartidores. Entre los dos reparten ⟦num:12⟧ sacos. El mensaje «deja el saco» sale ⟦num:12⟧ veces.',
  'Cada saco se deposita una vez y se reparte una vez.');

test(D, 'Error: if en lugar de while',
  'Este `repartir()` usa `if` en lugar de `while`. Con **dos repartidores**, ¿qué problema puede ocurrir?',
  [
    ['Un repartidor despierta, pero otro ya repartió el saco: repartiría un saco que no existe.', true],
    ['El programa no compila.', false],
    ['El granjero nunca puede dejar.', false],
    ['Ninguno: `if` y `while` hacen lo mismo aquí.', false],
  ],
  'Tras `wait()` el hilo debe volver a mirar la condición: cuando se despierta, el estado pudo cambiar.',
  { codigo: mostrar('6.4 if en vez de while', `class Cobertizo {
    private int numSacos = 0;

    public synchronized void repartir() throws InterruptedException {
        if (numSacos == 0) {
            wait();
        }
        numSacos--;
        System.out.println("reparte el saco");
        notifyAll();
    }
}`) });

// =====================================================================
// 6.5 PROBLEMAS DE SINCRONIZACIÓN
// =====================================================================
const E = '6.5';
categoria('Repaso PSP Unidad 1/6.5 Problemas de sincronización');

completar(E, 'El patrón de un objeto compartido',
  'Casi todos los problemas de sincronización siguen el mismo esquema: un objeto compartido con métodos `synchronized`. Completa el esquema de uno de sus métodos (las palabras `no puedo continuar` son solo una descripción).',
  `public ⟦sa:synchronized⟧ void metodo() {
    ⟦sa:while⟧ (no puedo continuar) {
        ⟦sa:wait⟧();
    }
    // cambio el estado
    ⟦sa:notifyAll⟧();
}`,
  'Un objeto compartido con métodos `synchronized`; si el hilo no puede continuar, `while (no puedo) wait();`; cuando cambia el estado, `notifyAll();`.',
  { compilar: false });

multi(E, 'Qué hacen los hilos',
  'En un problema de sincronización típico (varios hilos comparten un objeto con métodos `synchronized`), los hilos solo... Marca lo **correcto**:',
  [
    ['Duermen (simulan que algo tarda).', true],
    ['Llaman a los métodos del objeto compartido.', true],
    ['Repiten.', true],
    ['Hacen ellos mismos el `wait()` y el `notifyAll()`.', false],
    ['Guardan cada uno su propia copia del estado.', false],
  ],
  'El `wait()`, el `notifyAll()` y los datos viven en el objeto compartido.');

test(E, 'sleep fuera de synchronized',
  'Una piscina tiene varias calles compartidas. Cada nadador (hilo) llama a `entrar()` (ocupa una calle), nada durante 5 a 10 segundos con `sleep` y llama a `salir()`. ¿Por qué el `sleep` va **fuera** de los métodos `synchronized` `entrar()` y `salir()`?',
  [
    ['Si un hilo duerme dentro, los demás no pueden ni entrar; fuera, las otras calles siguen funcionando.', true],
    ['Porque `sleep` no se puede usar dentro de `synchronized`.', false],
    ['Para que los nadadores lleguen antes.', false],
    ['Porque así el nadador no se cansa.', false],
  ],
  'Regla: `sleep` va fuera de `synchronized`.');

completarTexto(E, 'Random y sleep',
  '`azar.nextInt(4)` da ⟦num:0⟧, 1, 2 o 3. Con `(2 + azar.nextInt(4)) * 500` el robot duerme como mínimo ⟦num:1000⟧ milisegundos y como máximo ⟦num:2500⟧.',
  '`sleep` trabaja en milisegundos: por eso se multiplica. 2 × 500 = 1000 y 5 × 500 = 2500.');

emparejar(E, 'Clases nuevas de 6.5',
  'Une cada clase o método con lo que hace:',
  [
    ['`Random` y `nextInt(4)`', 'Da al azar 0, 1, 2 o 3'],
    ['`Scanner` y `nextInt()`', 'Lee un número que escribe el usuario'],
    ['`ArrayList<Thread>`', 'Una lista de hilos que crece sola'],
    ['`FileWriter`', 'Escribe en un fichero'],
    ['`Files.readAllLines(...)`', 'Lee un fichero y devuelve una lista con una entrada por línea'],
  ],
  'Son las clases nuevas del apartado 6.5.');

test(E, 'Libro de visitas: hace falta wait',
  'Varios hilos **visitantes** añaden su nombre a un libro de visitas (un fichero de texto compartido) y varios hilos **recepcionistas** cuentan cuántas firmas tiene. Los métodos `firmar()` y `contarFirmas()` del objeto que representa el libro son `synchronized`. ¿Hace falta además `wait()` y `notifyAll()`?',
  [
    ['No: nadie tiene que esperar a que ocurra nada concreto. Solo no pisarse.', true],
    ['Sí, los visitantes esperan a los recepcionistas.', false],
    ['Sí, porque los ficheros siempre requieren `wait()`.', false],
    ['Sí, los recepcionistas esperan a que haya visitantes.', false],
  ],
  'Con `synchronized` basta: mientras uno trabaja, los demás esperan fuera.');

test(E, 'contarFirmas synchronized',
  'Varios visitantes añaden firmas a un libro compartido con un método `synchronized firmar()`. Los recepcionistas cuentan las firmas con `contarFirmas()`, un método que **solo lee** pero que también es `synchronized`. ¿Por qué?',
  [
    ['Para que un recepcionista no lea datos a medias mientras alguien firma.', true],
    ['Porque leer un fichero siempre exige `synchronized`.', false],
    ['Para que los recepcionistas firmen más rápido.', false],
    ['Porque si no, no compila.', false],
  ],
  'Quien lee tampoco entra si hay alguien escribiendo: los dos métodos comparten el cerrojo.');

test(E, 'FileWriter con true',
  '¿Qué significa el segundo argumento `true` en `new FileWriter(ruta, true)`?',
  [
    ['Añadir al final del fichero.', true],
    ['Borra el fichero y empieza de cero.', false],
    ['Abre el fichero solo para leer.', false],
    ['Crea un fichero nuevo y falla si ya existe.', false],
  ],
  'Sin el `true` borraría lo anterior.');

completar(E, 'Registro.firmar()',
  'Completa el método que escribe un nombre al final del libro de visitas compartido.',
  `import java.io.FileWriter;
import java.io.IOException;

class Registro {
    private String ruta = "visitas.txt";

    public ⟦sa:synchronized⟧ void firmar(String nombre) {
        try {
            FileWriter fw = new FileWriter(ruta, ⟦mc:true|false⟧);
            fw.write(nombre + "\\n");
            fw.⟦sa:flush⟧();
            fw.close();
        } catch (⟦sa:IOException⟧ e) {
            System.out.println("No se ha podido escribir");
        }
    }
}`,
  '`synchronized` para que no se mezclen escrituras, `true` para añadir, `flush()` (o `close()`) para que lo escrito llegue al fichero e `IOException` porque Java obliga a prever que un fichero puede fallar.');

emparejar(E, 'Qué hace esperar a cada hilo',
  'Une cada situación con la condición que hace **esperar** al hilo:',
  [
    ['Un buzón de sugerencias con espacio para 5 notas: un alumno quiere dejar una', 'Espera mientras el buzón esté lleno'],
    ['El mismo buzón: el director quiere leer una nota', 'Espera mientras el buzón esté vacío y se sigan dejando notas'],
    ['Una pista de tenis compartida: una pareja quiere jugar', 'Espera mientras la pista esté ocupada'],
    ['Una frutería tiene existencias de naranjas y un cliente pide 3 kilos', 'Espera hasta que haya al menos 3 kilos'],
    ['Una radio emite en directo y los oyentes solo pueden llamar durante el programa: un oyente quiere llamar', 'Espera mientras no haya un programa en directo'],
  ],
  'En todos el hilo espera con `while (no puedo) wait();` y se le avisa con `notifyAll()` cuando cambia el estado.',
  { grado: 2 });

test(E, 'El contador de 200 entradas',
  'Cuatro taquillas (hilos) venden entradas de un concierto y se deben dejar de vender al llegar a 200 entradas vendidas **entre las cuatro**. ¿Dónde se cuenta?',
  [
    ['En el objeto compartido (el concierto), no en cada taquilla.', true],
    ['En cada taquilla, y cada una para a las 200.', false],
    ['En `Principal`, con un `for`.', false],
    ['En el hilo del público.', false],
  ],
  'El límite de 200 es de todas las taquillas juntas. Contar el límite en cada hilo en vez de en el objeto compartido es un error típico.');

completar(E, 'Muelle: apilar()',
  'Completa `apilar()` del muelle (capacidad 4; se apilan 30 contenedores en total). Devuelve `true` mientras la grúa deba seguir.',
  `class Muelle {
    private static final int CAPACIDAD = 4;
    private static final int TOTAL_CONTENEDORES = 30;
    private int enMuelle = 0;
    private int apilados = 0;
    private boolean seguirApilando = true;

    public synchronized boolean apilar() throws InterruptedException {
        while (enMuelle == ⟦sa:CAPACIDAD⟧) {
            wait();
        }
        if (apilados >= TOTAL_CONTENEDORES) {
            seguirApilando = ⟦sa:false⟧;
        } else {
            enMuelle++;
            apilados++;
        }
        ⟦sa:notifyAll⟧();
        return ⟦sa:seguirApilando⟧;
    }
}`,
  'La grúa espera si el muelle está lleno. Si ya se apilaron todos los contenedores, apaga la bandera `seguirApilando`; si no, apila uno. Siempre avisa y devuelve la bandera: `true` mientras haya que seguir y `false` la primera vez que se descubre que ya está todo.');

test(E, 'Cuándo termina el camión',
  'En el muelle, un camión (hilo) se lleva los contenedores con el método `descargar()`. ¿Cuándo debe devolver `false` ese método para que el camión termine?',
  [
    ['Cuando el muelle está vacío **y** ya no se apilan más contenedores.', true],
    ['Cuando el muelle está vacío.', false],
    ['Cuando ya se han apilado los 30 contenedores.', false],
    ['Cuando ha pasado un tiempo fijo.', false],
  ],
  'Si terminara con el muelle vacío, podría irse antes de que lleguen los últimos contenedores. Y si terminara al apilarse los 30, quedarían contenedores sin llevar en el muelle.');

test(E, 'Dos banderas',
  'El muelle tiene dos banderas, `seguirApilando` y `seguirDescargando`. ¿Por qué hacen falta dos?',
  [
    ['Porque cada papel termina en un momento distinto: las grúas al apilar los 30 y el camión cuando ya no queda ningún contenedor.', true],
    ['Porque una `boolean` no puede valer `false`.', false],
    ['Porque así se evita usar `synchronized`.', false],
    ['Para que las grúas cuenten los contenedores.', false],
  ],
  'Los hilos no cuentan nada: preguntan al muelle si deben seguir. Una bandera por papel.');

test(E, 'notify o notifyAll en el muelle',
  'En el muelle, las grúas esperan con el muelle lleno y el camión espera con el muelle vacío. Si `apilar()` y `descargar()` usan `notify()` en vez de `notifyAll()`, ¿funciona?',
  [
    ['Sí: un muelle no puede estar lleno y vacío a la vez, así que los que esperan son siempre del mismo tipo y despertar a uno basta. `notifyAll()` es lo más seguro.', true],
    ['No: se cuelga siempre.', false],
    ['No compila.', false],
    ['Solo funciona con una grúa.', false],
  ],
  'Con papeles que esperan **a la vez**, como el granjero y los repartidores de 6.4, `notify()` puede despertar al equivocado. Aquí no esperan a la vez.');

test(E, 'Muelle cerrado y join',
  '¿Cuándo aparece «Muelle cerrado»?',
  [
    ['Siempre la última línea, porque `join()` hace que `main` espere al hilo.', true],
    ['Siempre la primera línea, porque `main` va antes que los hilos.', false],
    ['En cualquier posición: `join()` no influye en el orden.', false],
    ['Nunca: `join()` impide que `main` imprima.', false],
  ],
  '«Espero aquí hasta que ese hilo termine». Sin los `join()`, «Muelle cerrado» saldría al principio, porque `main` no espera.',
  { codigo: mostrar('6.5 muelle cerrado', `class Grua implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " apila");
    }
}

class Principal {
    public static void main(String[] args) throws InterruptedException {
        Thread g1 = new Thread(new Grua(), "G1");
        g1.start();
        g1.join();
        System.out.println("Muelle cerrado");
    }
}`) });

vf(E, 'throws en main',
  '`main` declara `throws InterruptedException` para no escribir un `try/catch` en cada `join`.',
  true,
  'Verdadero.');

numerica(E, 'Qué línea los serializa',
  '`Pasos` es un `Runnable` que cuenta del 1 al 10. Con este código, los dos hilos salen **uno detrás de otro**, sin mezclarse. ¿Qué número de línea lo provoca?',
  4,
  'La línea 4: `h1.join()` hace que `main` espere a que `h1` termine **antes** de llegar a `h2.start()` en la línea 5.',
  { codigo: `1  Thread h1 = new Thread(new Pasos(), "Hilo 1");
2  Thread h2 = new Thread(new Pasos(), "Hilo 2");
3  h1.start();
4  h1.join();
5  h2.start();` });

test(E, 'Atendido tras el while',
  'En una peluquería con sillones compartidos, un cliente solo debe contarse como **atendido** cuando consigue un sillón (no mientras espera). ¿Dónde se incrementa `atendidos` en `sentar()`?',
  [
    ['Justo después del `while`, cuando ya tiene sillón.', true],
    ['Nada más llegar, antes del `while`.', false],
    ['Cuando termina el corte.', false],
    ['Cuando paga al salir.', false],
  ],
  'Después del `while` el cliente ya ha conseguido sillón; antes, todavía puede estar esperando.',
  { codigo: `public synchronized void sentar() {
    // ¿aquí?
    while (libres == 0) {
        try {
            wait();
        } catch (InterruptedException e) {
        }
    }
    // ¿o aquí?
    libres--;
}` });

test(E, 'Cuándo se mira la condición del do while',
  'Un programa muestra un menú con `do { opcion = sc.nextInt(); … } while (opcion != 0);`. El usuario escribe 0 la primera vez. ¿Qué ocurre?',
  [
    ['El bloque se ejecuta una vez y después termina: la condición se mira al final.', true],
    ['El bloque no se ejecuta ninguna vez.', false],
    ['El bloque se ejecuta para siempre.', false],
    ['El programa no compila.', false],
  ],
  'El `do while` siempre ejecuta el bloque al menos una vez y mira la condición al final. Con `while` a secas, no se ejecutaría ninguna.');

test(E, 'Tandas de participantes',
  'Los participantes de una carrera se apuntan en varias tandas. `total` cuenta los apuntados hasta ahora y `n` es cuántos llegan en esta tanda. Los hilos se guardan en una lista. ¿Con qué `for` se crean **solo los nuevos** sin repetir nombres?',
  [
    ['`for (int i = total; i < total + n; i++)`', true],
    ['`for (int i = 0; i < n; i++)`', false],
    ['`for (int i = 0; i < total; i++)`', false],
    ['`for (int i = total; i < n; i++)`', false],
  ],
  'Si cada tanda empezara en 0, los nombres se repetirían y se intentarían arrancar hilos que ya están en marcha.');

test(E, 'ArrayList de participantes',
  'Un menú permite que se apunten grupos de participantes a una carrera (cada participante es un hilo) sin saber cuántos serán en total. Quieres guardar los hilos para hacerles `join()` al terminar. ¿Por qué usar un `ArrayList<Thread>` y no un array `Thread[]`?',
  [
    ['No sabemos cuántos participantes habrá, así que un array de tamaño fijo no sirve: la lista crece sola.', true],
    ['Porque los arrays no pueden guardar hilos.', false],
    ['Porque `ArrayList` hace que los hilos vayan más rápido.', false],
    ['Porque `join()` solo funciona con `ArrayList`.', false],
  ],
  'Después, `for (Thread t : participantes) { t.join(); }` espera a todos.');

completarTexto(E, 'Peluquería',
  'La peluquería tiene 3 sillones y llegan 8 clientes a la vez. Al principio esperan en la cola ⟦num:5⟧ clientes. Cada uno paga 12 €: cuando se han atendido los 8, la recaudación total es de ⟦num:96⟧ €.',
  '8 − 3 = 5 esperan; 8 × 12 = 96 €.');

test(E, 'Fabricar fuera de synchronized',
  'Un alfarero (hilo) fabrica una tanda de 20 jarrones (tarda 15 segundos, con `sleep`) y luego los añade a un estante compartido con un método `synchronized colocar()`. Los clientes compran con otro método `synchronized comprar()`. ¿Por qué el alfarero fabrica **fuera** de los métodos `synchronized`?',
  [
    ['Para que los clientes puedan seguir comprando mientras se fabrica.', true],
    ['Porque `sleep` no se puede usar dentro de `synchronized`.', false],
    ['Porque los clientes nunca compran mientras el alfarero trabaja.', false],
    ['Para que el alfarero termine antes.', false],
  ],
  'Fabricar tarda 15 s: dentro de `synchronized`, los clientes no podrían comprar mientras tanto.');

numerica(E, 'Precio en la cafetería',
  'Una cafetería cobra el primer café a 1,50 € y cada uno de los demás a 1 €. Un cliente toma **4 cafés**. ¿Cuántos euros paga? (usa punto o coma decimal)',
  4.5,
  '1,50 + 1 × 3 = 4,50 €. (Con 3 cafés serían 1,50 + 1 × 2 = 3,50 €.)',
  { tolerancia: 0.001 });

test(E, 'Cliente espera tantos como pide',
  'En una frutería, un cliente pide `kilos` de naranjas (de 1 a 10) a las existencias compartidas y debe **esperar** si no hay suficientes. ¿Qué condición usa el `while` de `comprar(int kilos)`?',
  [
    ['`while (existencias < kilos)`: espera hasta que haya tantos como pide, no solo «alguno».', true],
    ['`while (existencias == 0)`: espera hasta que haya alguno.', false],
    ['`while (existencias > kilos)`.', false],
    ['No usa `while`: usa `if`.', false],
  ],
  'Un cliente que pide 7 kilos espera hasta que haya 7.');

arrastrar(E, 'Cerrar la pizzería',
  'En una pizzería, un hilo pizzero hornea sin parar y vigila el mostrador; los repartidores son hilos. Algunos repartidores siguen esperando pizzas cuando se decide cerrar. Ordena los pasos para **cerrar** la pizzería.',
  `1. [[1]]
2. [[2]]
3. [[3]]
4. [[4]]
5. [[5]]`,
  [
    'Salir del menú: no se aceptan más pedidos',
    'join() a todos los repartidores: los que esperan pizza se atienden',
    'mostrador.cerrar(): avisa al pizzero',
    'El pizzero sale de su bucle, se lleva lo que queda y hornea la última tanda',
    'join() al pizzero y resumen final',
  ],
  'El orden importa: si se avisara al pizzero **antes**, vaciaría el mostrador y los repartidores que esperan se quedarían colgados.',
  { esCodigo: false, grado: 3 });

test(E, 'Espectador sin número de sesión',
  'En un cine con una sola sala, cada sesión tiene un **número**. Un espectador entra a ver una sesión y debe irse cuando termine **esa** sesión, aunque ya haya empezado otra. ¿Qué pasa si el espectador no apunta el número de su sesión y solo comprueba si hay alguna película en marcha?',
  [
    ['Se quedaría a ver la siguiente sesión sin darse cuenta, en vez de irse cuando acaba la suya.', true],
    ['No podría entrar a la sala.', false],
    ['Saldría antes de que empiece la sesión.', false],
    ['No pasa nada: se comporta igual.', false],
  ],
  'Se queda mientras `proyectando && sesion == miNumero`.');

redaccion(E, 'Diseña tu propio problema',
  'Una biblioteca tiene **3 ordenadores**. Muchos alumnos (hilos) los usan. Escribe la clase `Biblioteca` con los métodos `entrar()` (espera si no hay ordenador libre y ocupa uno) y `salir()` (libera uno y avisa). Debe ser segura entre hilos.',
  `public class Biblioteca {
    private int libres = 3;

    public synchronized void entrar() {
        while (libres == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        libres--;
    }

    public synchronized void salir() {
        libres++;
        notifyAll();
    }
}`, '', { grado: 5 });

// =====================================================================
// 6.6 LECTORES Y ESCRITORES
// =====================================================================
const F = '6.6';
categoria('Repaso PSP Unidad 1/6.6 Lectores y escritores');

completar(F, 'La puerta de la cabina',
  'Una cabina de fotos la usan clientes y técnicos de mantenimiento, y solo puede haber **una persona dentro**, sea quien sea. Completa `entrarCliente()`:',
  `public ⟦sa:synchronized⟧ void entrarCliente() throws InterruptedException {
    while (clientes > 0 ⟦sa:||⟧ tecnicos > 0) {
        ⟦sa:wait⟧();
    }
    clientes++;
}`,
  'El cliente espera mientras haya algún cliente **o** algún técnico dentro. Después se apunta con `clientes++`.',
  { compilar: false });

test(F, 'Qué significa ||',
  'En `if (edad < 12 || edad > 65) precio = 5;`, ¿qué edad paga 5 €?',
  [
    ['70', true],
    ['30', false],
    ['12', false],
    ['65', false],
  ],
  '`||` es «o»: basta con que se cumpla una de las dos condiciones. 70 es mayor que 65. Con `&&` («y») no pagaría nadie, porque nadie es menor de 12 y mayor de 65 a la vez.');

test(F, 'Hilos dentro a la vez',
  'En la cabina, los `while` de `entrarCliente()` y de `entrarTecnico()` son los dos `while (clientes > 0 || tecnicos > 0)`. ¿Cuántos hilos como máximo están dentro a la vez?',
  [
    ['Uno solo, sea cliente o técnico.', true],
    ['Varios clientes, pero un solo técnico.', false],
    ['Todos los clientes y un técnico.', false],
    ['Ninguno: se quedan esperando para siempre.', false],
  ],
  'Los dos `while` miran los dos contadores: mientras haya alguien dentro, el resto espera. Por eso entra uno solo cada vez.');

test(F, 'Condición del técnico',
  '¿Qué condición debe tener el `while` de `entrarTecnico()` para que un técnico no entre con nadie dentro de la cabina?',
  [
    ['`while (clientes > 0 || tecnicos > 0)`', true],
    ['`while (tecnicos > 0)`', false],
    ['`while (clientes > 0 && tecnicos > 0)`', false],
    ['`while (clientes == 0)`', false],
  ],
  'Con `while (tecnicos > 0)` el técnico entraría con un cliente dentro. Con `&&` solo esperaría si hubiera clientes **y** técnicos a la vez, algo imposible.');

test(F, 'sleep dentro del método',
  'El cliente hace `cabina.entrarCliente();`, luego `Thread.sleep(...)` (se hace las fotos) y luego `cabina.salirCliente();`. ¿Qué pasaría si el `sleep` estuviera **dentro** del método `synchronized` `entrarCliente()`?',
  [
    ['El cliente dormiría con el cerrojo de la cabina y los demás hilos ni siquiera podrían entrar a mirar.', true],
    ['No compilaría.', false],
    ['Los clientes se harían las fotos más rápido.', false],
    ['No cambiaría nada.', false],
  ],
  'Regla de siempre: `sleep` va fuera de los métodos `synchronized`, entre la llamada de entrar y la de salir.');

vf(F, 'throws InterruptedException',
  'Un método con `throws InterruptedException` no necesita `try/catch` dentro: el error lo recoge quien llama al método.',
  true,
  'Verdadero. Por eso el `try/catch` está en `run()` de `Cliente` y de `Tecnico`, que son quienes llaman a `entrarCliente()`.');

test(F, 'notify en vez de notifyAll',
  'En la cabina, todos los hilos que esperan esperan lo mismo: que la cabina quede libre. Si `salirCliente()` y `salirTecnico()` usan `notify()` en vez de `notifyAll()`, ¿el programa funciona?',
  [
    ['Sí: despertar a uno cualquiera basta, porque ese hilo puede entrar. `notifyAll()` es la opción segura.', true],
    ['No: se cuelga siempre.', false],
    ['No compila.', false],
    ['Sí, pero solo con un cliente.', false],
  ],
  'Con papeles que esperan cosas distintas a la vez, como el granjero y los repartidores de 6.4, `notify()` puede despertar al equivocado. Aquí no, pero `notifyAll()` sigue siendo lo más seguro.');

arrastrar(F, 'Qué hace el hilo cliente',
  'Ordena lo que hace `Cliente.run()`:',
  `1. [[1]]
2. [[2]]
3. [[3]]`,
  [
    'cabina.entrarCliente();',
    'Thread.sleep((r.nextInt(5) + 1) * 1000);',
    'cabina.salirCliente();',
  ],
  'Primero se pide permiso, después se duerme (es el tiempo de hacerse las fotos, fuera de los métodos `synchronized`) y por último se avisa de que se sale.',
  { esCodigo: false });

emparejar(F, 'Contadores y métodos',
  'Une cada método de la cabina con lo que hace:',
  [
    ['`entrarCliente()`', 'Espera si hay alguien dentro y suma 1 a `clientes`'],
    ['`entrarTecnico()`', 'Espera si hay alguien dentro y suma 1 a `tecnicos`'],
    ['`salirCliente()`', 'Resta 1 a `clientes` y avisa con `notifyAll()`'],
    ['`salirTecnico()`', 'Resta 1 a `tecnicos` y avisa con `notifyAll()`'],
  ],
  'Los cuatro métodos son `synchronized`. Los de entrar esperan con `wait()`; los de salir avisan con `notifyAll()`.');

redaccion(F, 'Escribe el técnico',
  'Escribe la clase `Tecnico` de la cabina de fotos. Implementa `Runnable`, recibe la `Cabina` en el constructor y en `run()` entra a revisar la cabina, duerme de 1 a 5 segundos y sale.',
  `import java.util.Random;

public class Tecnico implements Runnable {

    private Cabina cabina;

    public Tecnico(Cabina cabina) {
        this.cabina = cabina;
    }

    private Random r = new Random();

    @Override
    public void run() {
        try {
            cabina.entrarTecnico();
            Thread.sleep((r.nextInt(5) + 1) * 1000);
            cabina.salirTecnico();
        } catch (InterruptedException ex) {
        }
    }
}`, '', { grado: 4 });

// =====================================================================
// 6.7 SEMÁFORO: VARIOS LECTORES A LA VEZ
// =====================================================================
const G = '6.7';
categoria('Repaso PSP Unidad 1/6.7 Varios a la vez: semáforo y ficheros');

completar(G, 'Estados de la piscina',
  'Una piscina la usan **varios nadadores a la vez**, pero el operario de limpieza necesita la piscina vacía y para él solo. Completa los estados y la puerta del nadador:',
  `class Piscina {
    public ⟦sa:static⟧ ⟦sa:final⟧ int LIBRE = 0;
    public static final int CON_NADADORES = 1;
    public static final int CON_LIMPIEZA = 2;

    private int estado = LIBRE;
    private int nadadores = 0;

    public synchronized void entrarNadador() throws InterruptedException {
        while (estado == ⟦sa:CON_LIMPIEZA⟧) {
            wait();
        }
        estado = ⟦sa:CON_NADADORES⟧;
        nadadores++;
    }
}`,
  '`static final` crea una constante con nombre. El nadador solo espera si hay limpieza: con otros nadadores dentro, entra. Al entrar, el estado pasa a `CON_NADADORES` y suma uno.');

test(G, 'Qué es una constante static final',
  '¿Qué significa `public static final int LIBRE = 0;` dentro de una clase?',
  [
    ['Una constante de la clase: su valor no se puede cambiar y se escribe en mayúsculas.', true],
    ['Una variable que cambia en cada hilo.', false],
    ['Un método que devuelve 0.', false],
    ['Un hilo que se ejecuta una sola vez.', false],
  ],
  '`static` hace que pertenezca a la clase y `final` que no pueda cambiar. Sirve para dar nombre a los valores en vez de escribir números sueltos.');

emparejar(G, 'Estado y quién puede entrar',
  'Une cada estado de la piscina con lo que ocurre:',
  [
    ['`LIBRE`', 'Puede entrar un nadador o el operario de limpieza'],
    ['`CON_NADADORES`', 'Pueden entrar más nadadores, pero el operario espera'],
    ['`CON_LIMPIEZA`', 'No puede entrar nadie: todos esperan'],
  ],
  'El estado resume lo que el objeto necesita saber para decidir quién entra.',
  { grado: 2 });

vf(G, 'Varios nadadores a la vez',
  'Si la puerta del nadador es `while (estado == CON_LIMPIEZA) wait();`, un nadador puede entrar aunque ya haya otros nadadores dentro.',
  true,
  'Verdadero. A un nadador solo le molesta el operario. Al operario, en cambio, le molesta cualquiera.');

test(G, 'Quién pone LIBRE',
  'En `salirNadador()`, el hilo hace `nadadores--;`. ¿Cuándo debe poner el estado en `LIBRE` y avisar a los que esperan?',
  [
    ['Solo cuando `nadadores` llega a 0: es el último en salir.', true],
    ['Siempre que sale un nadador.', false],
    ['Nunca: lo hace el operario.', false],
    ['Cuando entra el siguiente nadador.', false],
  ],
  'Si pusiera `LIBRE` al salir cada nadador, el operario podría entrar con nadadores todavía dentro.');

test(G, 'Operario entra con nadadores dentro',
  'Alguien programa `salirNadador()` poniendo `estado = LIBRE;` cada vez que sale un nadador, aunque queden otros. ¿Qué fallo puede ocurrir?',
  [
    ['El operario entra a limpiar con nadadores todavía en la piscina.', true],
    ['Los nadadores no pueden entrar nunca.', false],
    ['El programa no compila.', false],
    ['El contador `nadadores` sale negativo siempre.', false],
  ],
  'El contador de nadadores decide cuándo está de verdad vacía la piscina.');

test(G, 'notify o notifyAll con varios esperando',
  'El operario termina de limpiar y hay 6 nadadores esperando. ¿Qué ventaja tiene `notifyAll()` frente a `notify()`?',
  [
    ['Despierta a todos: los 6 nadadores pueden entrar a la vez. Con `notify()` despierta a uno y los demás esperan más.', true],
    ['`notify()` hace que se cuelgue el programa siempre.', false],
    ['No hay ninguna diferencia.', false],
    ['`notifyAll()` impide que entre el operario.', false],
  ],
  'Con `notify()` no se cuelga, pero entran de uno en uno: es menos eficiente.');

test(G, 'Inanición',
  'En la piscina llegan nadadores sin parar, y siempre hay alguien dentro. ¿Qué le puede ocurrir al operario de limpieza?',
  [
    ['Esperar indefinidamente: nunca llega a quedar la piscina vacía (inanición).', true],
    ['Entrar enseguida, porque tiene prioridad.', false],
    ['Que Java lance una excepción.', false],
    ['Nada: el operario siempre entra primero.', false],
  ],
  'Si los que entran a la vez se solapan para siempre, el estado nunca vuelve a `LIBRE`. Se llama inanición.');

test(G, 'Contador desfasado',
  'Un nadador suma `nadadores++` al entrar, pero justo después falla al abrir su taquilla (excepción) y nunca llama a `salirNadador()`. ¿Qué pasa con el operario?',
  [
    ['Ve siempre un nadador dentro y espera para siempre.', true],
    ['Entra igualmente.', false],
    ['El contador se corrige solo.', false],
    ['Java resta el nadador automáticamente.', false],
  ],
  'Si el hilo se interrumpe antes de salir, el contador queda mal. Conviene sumar el contador solo cuando ya está todo listo, o asegurar que se llama a salir.');

test(G, 'El texto sigue en el buffer',
  'Un programa guarda tareas en `tareas.txt` con un `BufferedWriter bw`: hace `bw.write("Comprar pan");` y `bw.newLine();`, pero **no** llama a `flush()` ni a `close()`. Después se abre el fichero. ¿Qué se ve?',
  [
    ['Nada: el texto sigue en el buffer y no ha llegado al fichero.', true],
    ['La línea «Comprar pan».', false],
    ['La línea «Comprar pan» dos veces.', false],
    ['El programa da error al abrir el fichero.', false],
  ],
  '`flush()` manda al fichero lo que hay en el buffer, y `close()` también lo hace al cerrar. Sin ninguno de los dos, el texto puede no llegar nunca.');

completar(G, 'Contar líneas de un fichero',
  'Completa el código que cuenta las líneas de `tareas.txt`. Respeta mayúsculas y minúsculas.',
  `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

class Contar {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader("tareas.txt"));
        int n = ⟦num:0⟧;
        while (br.⟦sa:readLine⟧() != ⟦sa:null⟧) {
            n++;
        }
        br.⟦sa:close⟧();
        System.out.println("Líneas: " + n);
    }
}`,
  '`readLine()` lee una línea y devuelve `null` cuando ya no quedan más. El contador empieza en 0 y `close()` cierra el fichero.');

numerica(G, 'Vueltas del while con readLine',
  'El fichero `notas.txt` tiene 7 líneas. ¿Cuántas veces se ejecuta el cuerpo de `while (br.readLine() != null) { n++; }`?',
  7,
  'Una vuelta por cada línea. A la octava llamada, `readLine()` devuelve `null` y el bucle termina.');

redaccion(G, 'Escribe la salida de la limpieza',
  'Escribe los métodos `entrarLimpieza()` y `salirLimpieza()` de la `Piscina` (con `nadadores` y `estado`, y las constantes `LIBRE`, `CON_NADADORES` y `CON_LIMPIEZA`). La limpieza solo entra si el estado es `LIBRE`; al salir, deja el estado `LIBRE` y avisa a todos. Deben ser seguros entre hilos.',
  `public synchronized void entrarLimpieza() throws InterruptedException {
    while (estado != LIBRE) {
        wait();
    }
    estado = CON_LIMPIEZA;
}

public synchronized void salirLimpieza() {
    estado = LIBRE;
    notifyAll();
}`, '', { grado: 4 });

// =====================================================================
// 6.8 INTERBLOQUEO
// =====================================================================
const H = '6.8';
categoria('Repaso PSP Unidad 1/6.8 Interbloqueo');

test(H, 'Qué es un interbloqueo',
  '¿Qué es un **interbloqueo** (deadlock)?',
  [
    ['Dos o más hilos esperan cada uno algo que tiene otro, y ninguno puede avanzar.', true],
    ['Un hilo que termina antes de tiempo con una excepción.', false],
    ['Un hilo que duerme demasiado con `sleep()`.', false],
    ['Un error de compilación por tener dos clases `synchronized`.', false],
  ],
  'El programa no da error: se queda parado para siempre porque los hilos se esperan en círculo.');

multi(H, 'Las cuatro condiciones',
  'Para que haya interbloqueo tienen que cumplirse **todas** estas condiciones. Marca las que lo son:',
  [
    ['Exclusión mutua: el recurso solo lo puede usar un hilo cada vez.', true],
    ['Retener y esperar: un hilo se queda con un recurso mientras pide otro.', true],
    ['Sin quitárselo: nadie puede arrebatar el recurso al hilo que lo tiene.', true],
    ['Espera en círculo: A espera a B y B espera a A.', true],
    ['Que haya más hilos que núcleos en el procesador.', false],
    ['Que los hilos usen `Thread.sleep()`.', false],
  ],
  'Si se evita una sola, no puede haber interbloqueo. `sleep()` y el número de núcleos no son condiciones.');

test(H, 'Dos robots y dos herramientas',
  'En un taller, el robot 1 coge el destornillador y después necesita el martillo. El robot 2 coge el martillo y después necesita el destornillador. Cada herramienta la usa un solo robot a la vez y ningún robot suelta la suya hasta terminar. ¿Qué puede ocurrir?',
  [
    ['Interbloqueo: cada robot espera la herramienta que tiene el otro.', true],
    ['Nada: cada robot acaba sin problema.', false],
    ['Una condición de carrera: se pierde un cambio.', false],
    ['El programa no compila.', false],
  ],
  'Cada uno retiene una herramienta y pide la del otro: espera en círculo.');

completar(H, 'Pedir las cuentas en orden',
  'Un banco mueve dinero entre dos cuentas. Para evitar el interbloqueo, **todos** los hilos piden las cuentas en el mismo orden: primero la `cuenta1` y después la `cuenta2`. Completa el bloque.',
  `public void mover(Cuenta cuenta1, Cuenta cuenta2) {
    ⟦sa:synchronized⟧ (⟦sa:cuenta1⟧) {
        synchronized (⟦sa:cuenta2⟧) {
            cuenta1.restar(10);
            cuenta2.sumar(10);
        }
    }
}`,
  'Se coge el cerrojo de la primera cuenta y, sin soltarlo, el de la segunda. Si todos los hilos piden primero la misma, no puede haber espera en círculo.',
  { compilar: false });

test(H, 'Transferencias cruzadas',
  'Dos hilos hacen una transferencia a la vez: el hilo 1 llama a `transferir(cuentaA, cuentaB)` y el hilo 2 a `transferir(cuentaB, cuentaA)`. Dentro, el método coge primero el cerrojo de la cuenta de origen y después el de la de destino. ¿Qué puede ocurrir?',
  [
    ['Interbloqueo: el hilo 1 tiene A y pide B, y el hilo 2 tiene B y pide A.', true],
    ['Nada: dos hilos nunca se molestan.', false],
    ['Se transfiere el dinero dos veces.', false],
    ['El programa lanza `IllegalMonitorStateException`.', false],
  ],
  'Cada hilo pide las cuentas en orden contrario. Es el interbloqueo clásico de las transferencias.');

test(H, 'Cómo evitar el interbloqueo',
  'Las transferencias entre cuentas provocan interbloqueo a veces. ¿Qué cambio lo evita?',
  [
    ['Que todos los hilos cojan los cerrojos en el mismo orden, por ejemplo siempre primero la cuenta de número menor.', true],
    ['Añadir `Thread.sleep()` dentro de la transferencia.', false],
    ['Quitar el `synchronized` de todos los métodos.', false],
    ['Subir la prioridad de los hilos.', false],
  ],
  'Con el mismo orden no hay espera en círculo. Quitar `synchronized` evitaría el bloqueo, pero volvería la condición de carrera.');

test(H, 'sleep y el cerrojo',
  'Un hilo está dentro de un método `synchronized` y llama a `Thread.sleep(2000)`. ¿Qué pasa con el cerrojo del objeto durante esos 2 segundos?',
  [
    ['Sigue en su poder: `sleep()` no lo suelta, y los demás hilos no pueden entrar.', true],
    ['Lo suelta mientras duerme.', false],
    ['Lo suelta solo si otro hilo se lo pide.', false],
    ['Desaparece y se crea uno nuevo al despertar.', false],
  ],
  'Solo `wait()` suelta el cerrojo. Por eso se puede provocar un interbloqueo durmiendo con un cerrojo cogido.');

test(H, 'Estado de un hilo interbloqueado',
  'Dos hilos están interbloqueados esperando cada uno el cerrojo que tiene el otro. ¿Qué devuelve `getState()` para cualquiera de ellos?',
  [
    ['`BLOCKED`', true],
    ['`TERMINATED`', false],
    ['`NEW`', false],
    ['`TIMED_WAITING`', false],
  ],
  '`BLOCKED` es esperar el cerrojo de un objeto. `TIMED_WAITING` es `sleep()` y `WAITING` es `wait()` o `join()`.');

emparejar(H, 'Estados de un hilo',
  'Une cada situación con el estado de `Thread` que devuelve `getState()`:',
  [
    ['Un hilo creado con `new Thread(...)` al que aún no se le ha llamado a `start()`', '`NEW`'],
    ['Un hilo que está en marcha ejecutando su código', '`RUNNABLE`'],
    ['Un hilo que espera entrar en un método `synchronized` ocupado', '`BLOCKED`'],
    ['Un hilo que ha llamado a `wait()` y espera un aviso', '`WAITING`'],
    ['Un hilo que está en `Thread.sleep(500)`', '`TIMED_WAITING`'],
    ['Un hilo que ya ha terminado su `run()`', '`TERMINATED`'],
  ],
  'Los seis estados de un hilo. `BLOCKED` y `WAITING` parecen iguales, pero uno espera un cerrojo y el otro un aviso.',
  { grado: 3 });

vf(H, 'Programa parado igual a interbloqueo',
  'Si un programa con hilos se queda parado sin terminar, siempre es un interbloqueo.',
  false,
  'Falso. También se queda parado si un hilo espera con `wait()` un `notify()` que nadie hace (estado `WAITING`). Con el interbloqueo, los hilos están en `BLOCKED`.');

vf(H, 'El interbloqueo depende del momento',
  'Un programa con riesgo de interbloqueo puede funcionar bien en una ejecución y bloquearse en otra.',
  true,
  'Verdadero. Depende de en qué momento llega cada hilo a pedir el segundo recurso. Que salga bien una vez no demuestra nada.');

arrastrar(H, 'La película de un interbloqueo',
  'Ordena los pasos de lo que ocurre cuando dos robots se bloquean con un destornillador y un martillo.',
  `1. [[1]]
2. [[2]]
3. [[3]]
4. [[4]]
5. [[5]]`,
  [
    'El robot 1 coge el destornillador y el robot 2 coge el martillo',
    'Cada robot sigue trabajando un rato sin soltar su herramienta',
    'El robot 1 pide el martillo y el robot 2 pide el destornillador',
    'Cada uno espera a que el otro suelte la suya',
    'Ninguno suelta nada y los dos se quedan parados para siempre',
  ],
  'Es el ciclo completo: retener, pedir el otro recurso, esperar en círculo y quedarse bloqueados.',
  { esCodigo: false, grado: 2 });

redaccion(H, 'Escribe la transferencia sin interbloqueo',
  'Escribe el método `mover(Cuenta origen, Cuenta destino, int cantidad)` de una clase de transferencias, de forma que **no haya interbloqueo** aunque dos hilos muevan dinero entre las mismas cuentas en sentido contrario. Las cuentas tienen un `getNumero()`, un `restar(int)` y un `sumar(int)`. Pista: coge siempre primero el cerrojo de la cuenta de número menor.',
  `public void mover(Cuenta origen, Cuenta destino, int cantidad) {
    Cuenta primera;
    Cuenta segunda;
    if (origen.getNumero() < destino.getNumero()) {
        primera = origen;
        segunda = destino;
    } else {
        primera = destino;
        segunda = origen;
    }
    synchronized (primera) {
        synchronized (segunda) {
            origen.restar(cantidad);
            destino.sumar(cantidad);
        }
    }
}`, '', { grado: 5 });

// =====================================================================
// SIMULACRO DE EXAMEN
// =====================================================================
const S = 'EX';
categoria('Repaso PSP Unidad 1/Simulacro de examen (mezcla)');

multi(S, 'Encuentra los fallos',
  'Este buzón debería permitir que un hilo deje un mensaje y otro lo recoja, con **varios** hilos usándolo. Marca los fallos **reales**:',
  [
    ['`dejar()` no es `synchronized`, pero usa `wait()` y `notify()`.', true],
    ['Usa `if` en lugar de `while` para volver a comprobar la condición.', true],
    ['Usa `notify()` en lugar de `notifyAll()`, y con varios hilos puede avisar al que no toca.', true],
    ['Falta un bucle `for` en el método.', false],
    ['`mensaje` debería ser de tipo `int`.', false],
  ],
  'Los tres fallos clásicos: falta `synchronized`, `if` en vez de `while` y `notify()` donde hace falta `notifyAll()`.',
  { grado: 3, codigo: mostrar('EX buzon con fallos', `class Buzon {
    private String mensaje = null;

    public void dejar(String m) throws InterruptedException {
        if (mensaje != null) {
            wait();
        }
        mensaje = m;
        notify();
    }
}`) });

arrastrar(S, 'Buzón completo',
  'Completa el buzón (productor/consumidor) arrastrando las palabras. Algunas se usan **varias veces** y algunas sobran.',
  `class Buzon {
    private String mensaje = null;

    public [[1]] void dejar(String m) throws InterruptedException {
        [[2]] (mensaje != null) {
            [[3]]();
        }
        mensaje = m;
        [[4]]();
    }

    public [[1]] String coger() throws InterruptedException {
        while (mensaje == null) {
            wait();
        }
        String m = mensaje;
        mensaje = null;
        [[4]]();
        return m;
    }
}`,
  ['synchronized', 'while', 'wait', 'notifyAll', 'if', 'sleep', 'notify', 'join'],
  'Mismo patrón de siempre: `synchronized` + `while` + `wait` para esperar, y `notifyAll` tras cambiar el estado.',
  { infinitas: [1, 4], grado: 4 });

test(S, 'Al despertar con notifyAll',
  'Varios hilos esperan en `wait()` y otro llama a `notifyAll()`. ¿Qué hace cada hilo al despertar?',
  [
    ['Vuelve a mirar su condición: el que puede seguir sigue y el que no vuelve a esperar.', true],
    ['Siguen todos, sin mirar nada.', false],
    ['Sigue solo el que lleva más tiempo esperando.', false],
    ['Terminan todos.', false],
  ],
  'Por eso `wait()` va dentro de un `while`: cada hilo comprueba otra vez la condición.');

vf(S, 'Dos métodos synchronized a la vez',
  'Dos hilos pueden estar a la vez dentro de dos métodos `synchronized` **distintos** del mismo objeto.',
  false,
  'Falso. El cerrojo es del objeto, no del método: mientras uno está dentro de cualquier método `synchronized`, el otro espera.');

numerica(S, 'Entradas al parking',
  'Un parking tiene 3 plazas. Lanzas 8 coches (hilos) y cada uno entra al parking 3 veces, llamando a un método `entrar()`. ¿Cuántas veces se ejecuta `entrar()` en total?',
  24,
  '8 coches × 3 entradas = 24. (Con `wait()` y `notifyAll()`, las plazas libres nunca bajan de 0 y al final quedan 3.)');

emparejar(S, 'Síntoma y causa',
  'Une cada síntoma con su causa más probable:',
  [
    ['El resultado cambia y a veces se pierden cambios', 'Falta synchronized (condición de carrera)'],
    ['El programa se queda colgado con hilos esperando para siempre', 'Falta notifyAll() o la señal de fin'],
    ['Las plazas libres salen negativas', 'Falta esperar con while y wait()'],
    ['El mensaje final sale al principio', 'Faltan los join()'],
    ['El código de run() se ejecuta en el hilo main', 'Se llamó a run() en vez de start()'],
    ['ArrayIndexOutOfBoundsException', 'for con <= en lugar de < en un array'],
  ],
  'Reconocer el síntoma ahorra mucho tiempo al depurar.',
  { grado: 3 });

redaccion(S, 'Problema completo de examen',
  'Un gimnasio tiene **4 máquinas** de pesas. Llegan 10 socios (hilos). Cada socio usa una máquina 2 segundos (con `sleep`) y la deja. Escribe las 3 clases: `Gimnasio` (recurso compartido con `usar()` y `dejar()`), `Socio` (`Runnable`) y `Principal` (crea los 10 hilos con nombre «Socio 1»…«Socio 10»).',
  `public class Gimnasio {
    private int libres = 4;

    public synchronized void usar() {
        while (libres == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        libres--;
        System.out.println(Thread.currentThread().getName() + " usa una máquina");
    }

    public synchronized void dejar() {
        libres++;
        System.out.println(Thread.currentThread().getName() + " deja la máquina");
        notifyAll();
    }
}

public class Socio implements Runnable {
    private Gimnasio gimnasio;

    public Socio(Gimnasio gimnasio) {
        this.gimnasio = gimnasio;
    }

    @Override
    public void run() {
        gimnasio.usar();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
        }
        gimnasio.dejar();
    }
}

public class Principal {
    public static void main(String[] args) {
        Gimnasio gimnasio = new Gimnasio();
        for (int i = 1; i <= 10; i++) {
            new Thread(new Socio(gimnasio), "Socio " + i).start();
        }
    }
}`, '', { grado: 10, lineas: 30 });

// ---------- salida ----------
const total = preguntas.filter((p) => !p.startsWith('<question type="category"')).length;
const salida = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${preguntas.join('\n')}
</quiz>
`;
writeFileSync(join(aqui, 'repaso-u1-moodle.xml'), salida);

// Con --comprobar se escribe el código de las preguntas para compilarlo a mano.
if (process.argv.includes('--comprobar')) {
const dir = join(aqui, 'comprobar-java');
rmSync(dir, { recursive: true, force: true });
paraCompilar.forEach((p, i) => {
  const d = join(dir, 'q' + String(i + 1).padStart(2, '0'));
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, 'Codigo.java'), `// ${p.nom}\n${p.java}\n`);
});
}
console.log(`Preguntas: ${total}. Fragmentos de código a comprobar: ${paraCompilar.length}.`);

// ---------- presentación de repaso (reveal.js, igual que las de contenido/) ----------
const porCategoria = new Map();
for (const d of diapos) {
  if (!porCategoria.has(d.cat)) porCategoria.set(d.cat, []);
  porCategoria.get(d.cat).push(d);
}

const secciones = [];
secciones.push(`<section>
<h2>Repaso de la Unidad 1</h2>
<p>PSP · 2º DAM · ${diapos.length} preguntas</p>
<p class="peque">Cada pregunta tiene una diapositiva de pregunta y la siguiente con la respuesta. Pulsa <b>→</b> para avanzar, <b>←</b> para volver y <b>O</b> para ver el índice.</p>
</section>`);

for (const [cat, lista] of porCategoria) {
  secciones.push(`<section class="portada"><h2>${xml(cat)}</h2><p>${lista.length} preguntas</p></section>`);
  lista.forEach((d, i) => {
    const cab = `<div class="cab"><span>${xml(cat)} · pregunta ${i + 1} de ${lista.length}</span><span class="tipo">${xml(d.tipo)}</span></div>`;
    secciones.push(`<section class="pregunta">${cab}<h3>${xml(d.nom.replace(/^[^ ]+ /, ''))}</h3>${d.enun}</section>`);
    secciones.push(`<section class="respuesta">${cab}<h3>Respuesta</h3>${d.resp}${d.expl ? '<div class="porque">' + d.expl + '</div>' : ''}</section>`);
  });
}

const css = `
:root{--azul:#1f4e8c;--ok:#1b7a3d;--no:#b3261e;--fondo:#ffffff;--texto:#1d2733;--suave:#5a6775;--caja:#eef3fa}
.reveal{font-size:30px;color:var(--texto)}
.reveal .slides section{text-align:left;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.reveal h2,.reveal h3{color:var(--azul);text-transform:none;letter-spacing:0}
.reveal h3{font-size:1.1em;margin:.1em 0 .5em}
.reveal code{background:var(--caja);padding:.05em .3em;border-radius:.25em;font-size:.9em}
.reveal pre{width:100%;box-shadow:none;font-size:.62em;line-height:1.35;background:#f5f7fa;border:1px solid #d6dde6;border-radius:.4em;padding:.5em .7em;margin:.5em 0}
.reveal pre code{background:none;padding:0;font-size:1em}
.reveal pre{white-space:pre-wrap}
.cab{display:flex;justify-content:space-between;font-size:.55em;color:var(--suave);border-bottom:1px solid #d6dde6;padding-bottom:.3em;margin-bottom:.4em}
.tipo{background:var(--caja);padding:.1em .7em;border-radius:1em;color:var(--azul)}
.respuesta .cab .tipo{background:#e3f3e8;color:var(--ok)}
.portada{text-align:center!important}
.peque{font-size:.7em;color:var(--suave)}
.op{margin:.3em 0 0 1.2em;font-size:.9em;list-style:lower-alpha}.op li{margin:.35em 0;padding:.1em .4em;border-radius:.3em}
.op li.ok{background:#e3f3e8;color:var(--ok);font-weight:600}.op li.no{color:var(--suave)}
.sol{font-size:1.5em;font-weight:700;text-align:center;margin:.8em 0}.sol.ok{color:var(--ok)}.sol.no{color:var(--no)}
mark{background:#fff3b0;color:#1d2733;font-weight:700;padding:0 .2em;border-radius:.2em}
.hueco{display:inline-block;min-width:2.6em;text-align:center;border-bottom:3px solid var(--azul);color:var(--azul);font-weight:700;margin:0 .15em}
.chip{display:inline-block;background:var(--caja);border:1px solid #c5d2e4;border-radius:.4em;padding:.05em .5em;margin:.15em .1em;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.75em}
.porque{margin-top:.6em;padding:.5em .8em;background:var(--caja);border-left:5px solid var(--azul);border-radius:.3em;font-size:.8em}
.porque p{margin:0}
/* colores de hueco: cada número y sus opciones comparten color */
.c1{--c:#2563eb}.c2{--c:#d97706}.c3{--c:#16a34a}.c4{--c:#9333ea}.c5{--c:#dc2626}.c6{--c:#0891b2}.c7{--c:#be185d}.c8{--c:#65a30d}
.hueco[class*=" c"]{background:color-mix(in srgb,var(--c) 18%,#fff);border-bottom-color:var(--c);color:var(--c);padding:0 .35em;border-radius:.25em .25em 0 0}
.grupo{display:inline-block;padding:.1em .5em;margin:.15em 0;border-radius:.4em;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 12%,#fff)}
.grupo .chip.num{background:var(--c);color:#fff;font-weight:700;border-color:var(--c)}
.grupo code{background:#fff}
mark[class^="c"]{background:color-mix(in srgb,var(--c) 22%,#fff);box-shadow:inset 0 -3px 0 var(--c)}
table.par{border-collapse:collapse;font-size:.85em}table.par td{padding:.25em .6em}
ul.par{font-size:.85em}
`;

const pagina = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Repaso Unidad 1 – PSP</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css">
<style>${css}</style>
</head>
<body>
<div class="reveal"><div class="slides">
${secciones.join('\n')}
</div></div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js"></script>
<script>
// Si una diapositiva no cabe, se reduce hasta que quepa.
function ajusta(sl){ if(!sl) return; sl.style.zoom=''; var h=sl.offsetHeight; if(h>740) sl.style.zoom=Math.max(0.5,740/h); }
Reveal.initialize({hash:true,slideNumber:'c/t',width:1280,height:760,margin:0.04,center:false,transition:'none',controls:true,progress:true})
  .then(function(){ ajusta(Reveal.getCurrentSlide()); Reveal.on('slidechanged', function(e){ ajusta(e.currentSlide); }); });
</script>
</body>
</html>
`;
writeFileSync(join(aqui, 'repaso-u1-presentacion.html'), pagina);
console.log(`Diapositivas: ${secciones.length} (${diapos.length} preguntas con su respuesta).`);
