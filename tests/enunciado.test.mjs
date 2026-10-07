import test from 'node:test';
import assert from 'node:assert/strict';
import { analizarEnunciado, paginaEnunciado } from '../lib/enunciado.mjs';

const CERCA = '`'.repeat(3);

const BUENO = `# Apartado X

Texto de intro.

## Ejercicio 1: algo

Haz algo con \`Thread\`.

### Pistas
Piensa en una clase.

### Más ayuda
Usa \`Runnable\`.

### Paso a paso
1. Crea la clase.
2. Lanza el hilo.

## Ejercicio 2: otra cosa

Segundo ejercicio.

### Pistas
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
  assert.throws(() => analizarEnunciado(roto), /Pistas.*lleva código/);
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
