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
