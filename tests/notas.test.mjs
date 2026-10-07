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
