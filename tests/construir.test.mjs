import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { construir } from '../lib/construir.mjs';

const CERCA = '`'.repeat(3);
const proyecto = new URL('..', import.meta.url).pathname;

function escribir(raiz, ruta, texto) {
  const archivo = join(raiz, ...ruta);
  mkdirSync(join(archivo, '..'), { recursive: true });
  writeFileSync(archivo, texto);
}

function repo({ conNotas = true, conEnunciado = true } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), 'psp-e2e-'));
  cpSync(join(proyecto, 'estilo'), join(raiz, 'estilo'), { recursive: true });
  const a = ['contenido', 'u1', '6.1-x'];
  escribir(raiz, ['contenido', 'u1', 'unidad.json'], '{"titulo":"Unidad 1","orden":1}');
  escribir(raiz, [...a, 'apartado.json'], '{"titulo":"6.1 X","orden":1,"resumen":"resumen"}');
  if (conEnunciado) {
    escribir(raiz, [...a, 'enunciado.md'],
      '# X\n\n## Ejercicio 1: uno\n\ntexto\n\n### Pistas\na\n\n### Más ayuda\nb\n\n### Paso a paso\n1. c\n');
  }
  escribir(raiz, [...a, 'presentacion.md'], '# Hola\n---\n{{codigo: P/A.java}}\n');
  escribir(raiz, [...a, 'proyectos', 'P', 'src', 'x', 'A.java'],
    'package x;\n\npublic class A { boolean b = 1 < 2; }\n');
  escribir(raiz, ['glosario', 'array.md'],
    `---\nnombre: array\n---\n\n## Qué es\n\nFila.\n\n## Para qué sirve\n\nGuardar.\n\n## Ejemplo mínimo\n\n${CERCA}java\nint[] a;\n${CERCA}\n`);
  if (conNotas) escribir(raiz, ['privado', 'u1', '6.1-x', 'notas-profesor.md'], '# Nota\n\nTEXTOSECRETO\n');
  return raiz;
}

const leer = (raiz, ...ruta) => readFileSync(join(raiz, 'docs', ...ruta), 'utf8');

test('construye todas las páginas y cifra las notas', () => {
  const raiz = repo();
  const r = construir({ raiz, frase: 'frase de prueba larga' });
  assert.deepEqual(r, { unidades: 1, apartados: 1, terminos: 1 });
  for (const f of ['index.html', '.nojekyll', 'glosario/index.html', 'estilo/tema.css',
    'u1/6.1-x/enunciado.html', 'u1/6.1-x/presentacion.html', 'u1/6.1-x/notas-profesor.html']) {
    assert.ok(existsSync(join(raiz, 'docs', f)), `falta docs/${f}`);
  }
  assert.doesNotMatch(leer(raiz, 'u1', '6.1-x', 'notas-profesor.html'), /TEXTOSECRETO/);
  assert.match(leer(raiz, 'u1', '6.1-x', 'presentacion.html'), /boolean b = 1 &lt; 2/);
  assert.match(leer(raiz, 'index.html'), /🔒 Notas/);
});

test('hay notas pero no hay PSP_FRASE: error que dice qué definir', () => {
  assert.throws(() => construir({ raiz: repo(), frase: undefined }), /PSP_FRASE/);
});

test('sin enunciado el índice no enlaza una página inexistente', () => {
  const raiz = repo({ conEnunciado: false });
  construir({ raiz, frase: 'frase de prueba larga' });
  assert.doesNotMatch(leer(raiz, 'index.html'), /enunciado\.html/);
  assert.equal(existsSync(join(raiz, 'docs', 'u1', '6.1-x', 'enunciado.html')), false);
});

test('sin notas no hace falta frase', () => {
  const raiz = repo({ conNotas: false });
  assert.doesNotThrow(() => construir({ raiz, frase: undefined }));
});
