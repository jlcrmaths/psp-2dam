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

test('incluirCodigo quita los comentarios de línea completa y el rango cuenta sin ellos', () => {
  const dir = mkdtempSync(join(tmpdir(), 'psp-com-'));
  const src = join(dir, 'Con', 'src', 'x');
  mkdirSync(src, { recursive: true });
  writeFileSync(join(src, 'Hilo.java'),
    'package x;\n\n// Explicación de la clase\npublic class Hilo {\n    // Explicación del atributo\n    int a = 1; // se queda\n    int b = 2;\n}\n');
  const entero = incluirCodigo('{{codigo: Con/Hilo.java}}', dir, 'p.md');
  assert.doesNotMatch(entero, /Explicación/);
  assert.match(entero, /int a = 1; \/\/ se queda/);
  const rango = incluirCodigo('{{codigo: Con/Hilo.java :: 2-3}}', dir, 'p.md');
  assert.match(rango, /int a = 1/);
  assert.match(rango, /int b = 2/);
  assert.doesNotMatch(rango, /public class Hilo/);
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
