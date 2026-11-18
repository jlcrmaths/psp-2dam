// Genera el examen de la Unidad 1 (hilos) para Moodle: examen-jueves-moodle.xml
// Uso: node cuestionarios/generar-examen-moodle.mjs
// Cada pregunta lleva UN criterio RA2: va en el nombre ([2.e]) y como etiqueta de Moodle (tag).
// Mismo contenido y puntos que privado/u1/examen/examen.html (10 puntos).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = (s) => xml(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const pre = (s) => '<pre>' + xml(s.replace(/^\n|\n$/g, '')) + '</pre>';
const cd = (s) => `<text><![CDATA[${s}]]></text>`;
const PUNTOS = 10;
const qs = [];
let n = 0;
let suma = 0;

const cab = (tipo, crit, titulo, texto, expl, grado, pen = '0.3333333') => {
  n++;
  suma += grado;
  return `<question type="${tipo}">
<name><text>${xml(`[${crit}] E${String(n).padStart(2, '0')} ${titulo}`)}</text></name>
<questiontext format="html">${cd(texto)}</questiontext>
<generalfeedback format="html">${cd(expl)}</generalfeedback>
<defaultgrade>${grado}</defaultgrade><penalty>${pen}</penalty><hidden>0</hidden>
<tags><tag><text>${crit}</text></tag><tag><text>examen-u1</text></tag></tags>`;
};

function test(crit, titulo, texto, ops, expl, grado) {
  if (ops.filter((o) => o[1]).length !== 1) throw new Error(titulo);
  qs.push(`${cab('multichoice', crit, titulo, '<p>' + md(texto) + '</p>', '<p>' + md(expl) + '</p>', grado, '0')}
<single>true</single><shuffleanswers>true</shuffleanswers><answernumbering>abc</answernumbering>
<correctfeedback format="html"><text></text></correctfeedback><partiallycorrectfeedback format="html"><text></text></partiallycorrectfeedback><incorrectfeedback format="html"><text></text></incorrectfeedback><shownumcorrectfeedback>0</shownumcorrectfeedback>
${ops.map((o) => `<answer fraction="${o[1] ? 100 : 0}" format="html">${cd(md(o[0]))}<feedback format="html"><text></text></feedback></answer>`).join('\n')}
</question>`);
}

function emparejar(crit, titulo, texto, pares, extra, expl, grado) {
  const sub = pares.map((p) => `<subquestion format="html">${cd(md(p[0]))}<answer><text>${xml(p[1])}</text></answer></subquestion>`)
    .concat(extra.map((e) => `<subquestion format="html"><text></text><answer><text>${xml(e)}</text></answer></subquestion>`)).join('\n');
  qs.push(`${cab('matching', crit, titulo, '<p>' + md(texto) + '</p>', '<p>' + md(expl) + '</p>', grado, '0')}
<shuffleanswers>true</shuffleanswers>
<correctfeedback format="html"><text></text></correctfeedback><partiallycorrectfeedback format="html"><text></text></partiallycorrectfeedback><incorrectfeedback format="html"><text></text></incorrectfeedback><shownumcorrectfeedback>1</shownumcorrectfeedback>
${sub}
</question>`);
}

// Cloze: ⟦sa:a|b⟧ respuesta corta (distingue mayúsculas), ⟦num:5⟧ número
function cloze(crit, titulo, texto, codigo, expl, grado, conPre = true) {
  const esc = (s) => s.replace(/[\\}~#\/]/g, (c) => '\\' + c);
  const h = (conPre ? xml(codigo) : md(codigo)).replace(/⟦(sa|num):([^⟧]*)⟧/g, (_, t, c) => {
    const o = c.split('|');
    return t === 'sa' ? '{1:SHORTANSWER_C:' + o.map((x) => '=' + esc(x)).join('~') + '}' : '{1:NUMERICAL:=' + o[0] + '}';
  });
  qs.push(`${cab('cloze', crit, titulo, '<p>' + md(texto) + '</p>' + (conPre ? '<pre>' + h.replace(/^\n|\n$/g, '') + '</pre>' : '<p>' + h + '</p>'), '<p>' + md(expl) + '</p>', grado)}
</question>`);
}

function redaccion(crit, titulo, texto, codigo, modelo, criterios, grado, lineas = 20) {
  const g = '<p><b>Solución y reparto de puntos</b> (acepta variantes equivalentes):</p>' + criterios + pre(modelo);
  qs.push(`${cab('essay', crit, titulo, '<p>' + md(texto) + '</p>' + (codigo ? pre(codigo) : ''), g, grado, '0')}
<responseformat>monospaced</responseformat><responserequired>1</responserequired>
<responsefieldlines>${lineas}</responsefieldlines><attachments>0</attachments><attachmentsrequired>0</attachmentsrequired>
<graderinfo format="html">${cd(g)}</graderinfo>
<responsetemplate format="html"><text></text></responsetemplate>
</question>`);
}

const lista = (...t) => '<ul>' + t.map((x) => `<li>${md(x)}</li>`).join('') + '</ul>';

// ============ Ejercicio 1 · Test (2,5 = 10 × 0,25) ============
const T = 0.25;
test('2.b', 'Llamar a run()', 'Tienes `Thread h = new Thread(new Tarea(), "H1");` y llamas a `h.run();`. ¿Qué ocurre?',
  [['Se crea un hilo nuevo y se ejecuta `run()` en él.', false], ['No compila.', false], ['`run()` se ejecuta como un método normal, en el hilo que lo llama.', true], ['El hilo queda dormido hasta llamar a `start()`.', false]],
  'Solo `start()` crea el hilo. `run()` llamado a mano es un método normal.', T);
test('2.b', 'join()', 'El hilo `main` llama a `h.join()`. ¿Qué hace?',
  [['Espera a que el hilo `h` termine.', true], ['Arranca el hilo `h`.', false], ['Mata el hilo `h`.', false], ['Une el hilo `h` con `main` en uno solo.', false]],
  '`join()` bloquea al que lo llama hasta que el otro hilo acaba.', T);
test('2.g', 'Prioridades', 'Un hilo A tiene prioridad 10 y un hilo B prioridad 1. ¿Qué se puede asegurar?',
  [['A termina siempre antes que B.', false], ['B nunca se ejecuta mientras A esté vivo.', false], ['B lanza una excepción.', false], ['Nada seguro: la prioridad es una sugerencia al planificador.', true]],
  'La prioridad es solo una sugerencia; el orden real lo decide el planificador.', T);
test('2.d', 'Estado en sleep', '¿En qué estado de `Thread.State` está un hilo que ejecuta `Thread.sleep(2000)`?',
  [['`BLOCKED`', false], ['`TIMED_WAITING`', true], ['`WAITING`', false], ['`TERMINATED`', false]],
  '`sleep` con tiempo es `TIMED_WAITING`. `WAITING` es esperar sin límite de tiempo.', T);
test('2.k', 'Falta una cuenta', 'Dos hilos ejecutan a la vez `contador++` sobre la misma variable y al final falta una cuenta. ¿Cómo se llama el problema?',
  [['Condición de carrera.', true], ['Interbloqueo.', false], ['Inanición.', false], ['Desbordamiento.', false]],
  '`contador++` son tres pasos (leer, sumar, escribir) y dos hilos se pisan.', T);
test('2.k', 'Qué es un interbloqueo', '¿Qué es un interbloqueo (deadlock)?',
  [['Un hilo que nunca consigue turno aunque los demás avanzan.', false], ['Dos o más hilos esperan cada uno algo que tiene otro y ninguno avanza.', true], ['Un hilo muere por una excepción.', false], ['Un error de compilación por tener dos cerrojos.', false]],
  'Espera circular: cada hilo tiene lo que otro necesita. Lo del primer apartado es inanición.', T);
test('2.f', 'synchronized en un método', '¿Qué efecto tiene la palabra `synchronized` en un método?',
  [['Crea un hilo nuevo para el método.', false], ['Impide que otros hilos lean la variable.', false], ['Solo un hilo a la vez puede estar dentro de los métodos sincronizados de ese objeto.', true], ['Lo hace más rápido.', false]],
  'El cerrojo es del objeto: mientras uno está dentro de cualquier método `synchronized`, los demás esperan.', T);
test('2.f', 'wait()', 'Un hilo llama a `wait()` dentro de un método `synchronized`. ¿Qué pasa?',
  [['Suelta el cerrojo y espera hasta que otro hilo llame a `notify()` o `notifyAll()`.', true], ['Duerme un tiempo fijo y sigue.', false], ['Se queda con el cerrojo mientras espera.', false], ['Termina el hilo.', false]],
  '`wait()` suelta el cerrojo; si no lo soltara, nadie podría avisar.', T);
test('2.f', 'Lectores y escritores', 'En el problema de lectores y escritores, ¿qué es cierto?',
  [['Varios escritores pueden escribir a la vez.', false], ['Varios lectores pueden leer a la vez; un escritor necesita estar solo.', true], ['Solo puede haber un lector a la vez.', false], ['Un lector y un escritor pueden coincidir sin problema.', false]],
  'Leer no cambia el dato, así que los lectores pueden compartir. Escribir exige estar solo.', T);
test('2.a', 'Cuándo usar hilos', '¿En cuál de estas situaciones es más útil usar varios hilos?',
  [['Un programa que imprime su nombre.', false], ['Un programa que lee un número y lo muestra.', false], ['Una aplicación que descarga un fichero grande y a la vez debe seguir respondiendo a los clics del usuario.', true], ['Calcular 2 + 2.', false]],
  'Varios hilos compensan cuando hay esperas largas o tareas que deben avanzar a la vez.', T);

// ============ Ejercicio 2 · Métodos (1) ============
emparejar('2.j', 'Métodos de la librería', 'Une cada método con lo que hace. Sobra una descripción.',
  [['`Thread.sleep(500)`', 'Pausa el hilo actual un tiempo.'], ['`h.join()`', 'Espera a que otro hilo termine.'], ['`Thread.yield()`', 'Sugiere al planificador que otro hilo use el procesador.'], ['`h.setPriority(...)`', 'Cambia el número que sugiere la importancia del hilo.'],
   ['`wait()`', 'Suelta el cerrojo y espera un aviso.'], ['`notifyAll()`', 'Despierta a todos los hilos que esperan en este objeto.'], ['`h.getState()`', 'Dice en qué estado está el hilo.'], ['`Thread.currentThread()`', 'Devuelve el hilo que está ejecutando esa línea.']],
  ['Elimina el hilo inmediatamente.'], 'Cada método tiene una sola función. La descripción «elimina el hilo» no es de ninguno.', 1);

// ============ Ejercicio 3 · Completar (1,5) ============
cloze('2.c', 'Autobús', 'Un autobús se va llenando: cada viajero es un hilo que sube 5 veces. En este programa se arranca un solo viajero. Escribe en cada hueco lo que falta. Los dos últimos: el primero pone el hilo en marcha y el segundo hace que «Fin» salga cuando el viajero ya ha terminado.',
`class Autobus {
    private int pasajeros = ⟦num:0⟧;
    public ⟦sa:synchronized⟧ void sube() {
        pasajeros⟦sa:++⟧;
        System.out.println(Thread.currentThread().⟦sa:getName⟧() + ": " + pasajeros);
    }
}
class Viajero ⟦sa:implements⟧ Runnable {
    private Autobus a;
    public Viajero(Autobus a) { this.a = a; }
    @Override
    public void ⟦sa:run⟧() {
        for (int i = 0; i ⟦sa:<|<=⟧ 5; i++) {
            a.sube();
        }
    }
}
public class Principal {
    public static void main(String[] args) throws InterruptedException {
        Autobus a = new Autobus();
        Thread h = new ⟦sa:Thread⟧(new Viajero(a), "Viajero 1");
        h.⟦sa:start⟧();
        h.⟦sa:join⟧();
        System.out.println("Fin");
    }
}`, 'Contador a 0, método `synchronized`, `++`, `getName()`, `implements Runnable`, `run()`, `i < 5`, `new Thread`, `start()` y `join()`.', 1.5);

// ============ Ejercicio 4 · Salida (1) ============
const eco = `class Eco implements Runnable {
    private String t;
    public Eco(String t) { this.t = t; }
    public void run() { System.out.println(t); }
}
public class Principal {
    public static void main(String[] args) throws InterruptedException {
        Thread a = new Thread(new Eco("A"));
        Thread b = new Thread(new Eco("B"));
        System.out.println("1");
        a.start();
        a.join();
        System.out.println("2");
        b.start();
        b.join();
        System.out.println("3");
    }
}`;
qs.push(`${cab('cloze', '2.i', 'Salida con join (a)', '<p>¿Qué sale por pantalla? Escribe una línea de salida en cada hueco, de la primera a la última.</p>' + pre(eco) + '<p>Línea 1: {1:SHORTANSWER_C:=1} &nbsp; Línea 2: {1:SHORTANSWER_C:=A} &nbsp; Línea 3: {1:SHORTANSWER_C:=2} &nbsp; Línea 4: {1:SHORTANSWER_C:=B} &nbsp; Línea 5: {1:SHORTANSWER_C:=3}</p>', '<p>Salida: 1, A, 2, B, 3. Cada <code>join()</code> hace que <code>main</code> espere al hilo antes de seguir.</p>', 0.5)}
</question>`);
redaccion('2.i', 'Salida sin join (b)', 'Se borran las dos líneas `join()` del programa anterior. ¿Se puede asegurar que la salida sea la misma? ¿Podría salir el 3 antes que la A? Explica por qué.', '',
  'No. Sin join(), main sigue ejecutando mientras los hilos arrancan; el orden depende del planificador. Sí, el 3 podría salir antes que la A.',
  lista('0,25: responde «no».', '0,25: razón (sin `join()` `main` no espera; el orden lo decide el planificador; sí puede salir el 3 antes que la A).'), 0.5, 8);

// ============ Ejercicio 5 · Heladería (2) ============
redaccion('2.e', 'Heladería', 'La heladería. Cuatro cajeros atienden a la vez, cada uno como un hilo. Cada cajero cobra 25 helados, uno a uno. Entre todos comparten el número de helados vendidos. Cada vez que se cobra un helado se muestra el nombre del cajero y la cuenta total. El último mensaje tiene que decir siempre 100. Te damos el programa principal: escribe las clases `Heladeria` y `Cajero` para que funcione **sin cambiarlo**.',
`public class Principal {
    public static void main(String[] args) {
        Heladeria h = new Heladeria();
        for (int i = 1; i <= 4; i++) {
            new Thread(new Cajero(h), "Cajero " + i).start();
        }
    }
}`,
`public class Heladeria {
    private int vendidos = 0;
    public synchronized void cobra() {
        vendidos++;
        System.out.println(Thread.currentThread().getName() + ": " + vendidos);
    }
}
public class Cajero implements Runnable {
    private Heladeria h;
    public Cajero(Heladeria h) { this.h = h; }
    @Override
    public void run() {
        for (int i = 0; i < 25; i++) {
            h.cobra();
        }
    }
}`,
  lista('1,25: `Heladeria` con atributo `vendidos` y método `synchronized` que suma y muestra nombre y cuenta (sin `synchronized`, máximo 0,5 en esta clase).', '0,75: `Cajero implements Runnable`, recibe la heladería por constructor y `run()` con un `for` de 25 que llama al método de la heladería.'), 2, 30);

// ============ Ejercicio 6 · Fallos (1,5) ============
redaccion('2.f', 'Taquilla (6A)', 'Esta taquilla de cine la usan varios compradores y un reponedor a la vez. Un comprador espera si no quedan entradas. Señala **tres fallos** y explica en una frase por qué lo son. Después escribe la clase corregida.',
`class Taquilla {
    private int entradas = 0;
    public void reponer(int n) {
        entradas = entradas + n;
        notify();
    }
    public synchronized void vender() throws InterruptedException {
        if (entradas == 0) {
            wait();
        }
        entradas--;
    }
}`,
`class Taquilla {
    private int entradas = 0;
    public synchronized void reponer(int n) {
        entradas = entradas + n;
        notifyAll();
    }
    public synchronized void vender() throws InterruptedException {
        while (entradas == 0) {
            wait();
        }
        entradas--;
    }
}`,
  lista('0,15 cada fallo con su razón (0,45): 1) `reponer()` sin `synchronized`: `notify()` sin cerrojo da `IllegalMonitorStateException` y pisa `entradas`. 2) `if` en lugar de `while`: al despertar hay que volver a comprobar. 3) `notify()` en lugar de `notifyAll()`: puede despertar al que no toca.', '0,30: clase corregida.'), 0.75, 22);
redaccion('2.k', 'Dos impresoras (6B)', 'Dos hilos necesitan usar el escáner y la impresora para copiar un documento. (a) ¿Qué puede ocurrir al ejecutarlos a la vez? Explica el motivo. (b) Escribe el código del hilo 2 cambiado para que no pueda ocurrir.',
`// Hilo 1                              // Hilo 2
synchronized (escaner) {               synchronized (impresora) {
    synchronized (impresora) {             synchronized (escaner) {
        copiar();                              copiar();
    }                                      }
}                                      }`,
`a) Interbloqueo: el hilo 1 tiene el escáner y espera la impresora; el hilo 2 tiene la impresora y espera el escáner; ninguno suelta.
b) Mismo orden en los dos hilos:
synchronized (escaner) {
    synchronized (impresora) {
        copiar();
    }
}`, lista('0,25: nombra el interbloqueo. 0,25: motivo (espera circular).', '0,25: el hilo 2 pide primero el escáner y después la impresora (mismo orden que el hilo 1).'), 0.75, 14);

// ============ Ejercicio 7 · Estantería (0,5) ============
redaccion('2.f', 'Estantería', 'Una estantería de un almacén guarda como máximo 3 cajas. Varios hilos ponen cajas y varios hilos cogen cajas. Si está llena, el que pone espera. Si está vacía, el que coge espera. Escribe la clase `Estanteria` con los métodos `poner()` y `coger()`. Basta con llevar la cuenta de las cajas (un `int`).', '',
`class Estanteria {
    private int cajas = 0;
    public synchronized void poner() throws InterruptedException {
        while (cajas == 3) {
            wait();
        }
        cajas++;
        notifyAll();
    }
    public synchronized void coger() throws InterruptedException {
        while (cajas == 0) {
            wait();
        }
        cajas--;
        notifyAll();
    }
}`, lista('0,1: `synchronized`.', '0,2: `while` y `wait()` con la condición correcta en los dos métodos.', '0,1: `notifyAll()` tras cambiar la cuenta.', '0,1: `cajas++` y `cajas--`.'), 0.5, 22);

if (Math.abs(suma - PUNTOS) > 1e-9) throw new Error('Los puntos suman ' + suma + ', no ' + PUNTOS);

const salida = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
<question type="category"><category><text>$course$/top/Examen PSP Unidad 1 (hilos)</text></category></question>
${qs.join('\n')}
</quiz>
`;
writeFileSync(join(aqui, 'examen-jueves-moodle.xml'), salida);
console.log(`${qs.length} preguntas, ${suma} puntos`);
