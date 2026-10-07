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
