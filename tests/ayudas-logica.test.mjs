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
