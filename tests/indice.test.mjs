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
