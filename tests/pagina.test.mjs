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
