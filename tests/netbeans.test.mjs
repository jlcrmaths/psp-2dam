import test from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { claseMain, enlazarProyectos, generarProyecto, listarProyectos } from '../lib/netbeans.mjs';

const plantilla = new URL('../plantillas/netbeans', import.meta.url).pathname;

function repo() {
  const raiz = mkdtempSync(join(tmpdir(), 'psp-nb-'));
  const proyectos = join(raiz, 'u1', '6.1-x', 'proyectos');
  for (const [nombre, paquete] of [['Uno', 'crearhilos'], ['Dos Tres', 'otro']]) {
    const src = join(proyectos, nombre, 'src', paquete);
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, 'Principal.java'), `package ${paquete};\n\npublic class Principal {}\n`);
  }
  mkdirSync(join(proyectos, 'SinSrc'), { recursive: true });
  return raiz;
}

test('listarProyectos encuentra solo carpetas con src, en orden', () => {
  const lista = listarProyectos(repo());
  assert.deepEqual(lista.map((p) => p.nombre), ['Dos Tres', 'Uno']);
  assert.ok(lista[0].ruta.endsWith(join('proyectos', 'Dos Tres')));
});

test('claseMain lee el paquete de Principal.java y devuelve null si no hay', () => {
  const [dos, uno] = listarProyectos(repo());
  assert.equal(claseMain(uno.ruta), 'crearhilos.Principal');
  assert.equal(claseMain(dos.ruta), 'otro.Principal');
  assert.equal(claseMain(join(tmpdir(), 'no-existe-psp')), null);
});

test('generarProyecto crea los archivos de NetBeans con nombre, id y clase principal', () => {
  const [dos] = listarProyectos(repo());
  generarProyecto(dos.ruta, plantilla, dos.nombre);
  const props = readFileSync(join(dos.ruta, 'nbproject', 'project.properties'), 'utf8');
  assert.match(props, /application\.title=Dos Tres/);
  assert.match(props, /dist\.jar=\$\{dist\.dir\}\/Dos_Tres\.jar/);
  assert.match(props, /main\.class=otro\.Principal/);
  assert.match(props, /src\.dir=src\n/);
  assert.doesNotMatch(props, /\{\{/);
  const xml = readFileSync(join(dos.ruta, 'nbproject', 'project.xml'), 'utf8');
  assert.match(xml, /<name>Dos Tres<\/name>/);
  assert.match(readFileSync(join(dos.ruta, 'build.xml'), 'utf8'), /<project name="Dos_Tres"/);
  for (const f of ['manifest.mf', 'nbproject/build-impl.xml', 'nbproject/genfiles.properties']) {
    assert.ok(existsSync(join(dos.ruta, f)), `falta ${f}`);
  }
});

test('generarProyecto no pisa un proyecto que ya existe, salvo que se fuerce', () => {
  const [dos] = listarProyectos(repo());
  generarProyecto(dos.ruta, plantilla, dos.nombre);
  const archivo = join(dos.ruta, 'nbproject', 'project.properties');
  writeFileSync(archivo, 'editado=1\n');
  assert.equal(generarProyecto(dos.ruta, plantilla, dos.nombre), false);
  assert.equal(readFileSync(archivo, 'utf8'), 'editado=1\n');
  assert.equal(generarProyecto(dos.ruta, plantilla, dos.nombre, { forzar: true }), true);
  assert.match(readFileSync(archivo, 'utf8'), /application\.title=Dos Tres/);
});

test('enlazarProyectos crea enlaces, es idempotente y no pisa carpetas reales', () => {
  const proyectos = listarProyectos(repo());
  const destino = mkdtempSync(join(tmpdir(), 'psp-dest-'));
  mkdirSync(join(destino, 'Uno'));
  const r1 = enlazarProyectos({ proyectos, destino });
  assert.deepEqual(r1.creados, ['Dos Tres']);
  assert.deepEqual(r1.conflictos, ['Uno']);
  assert.ok(lstatSync(join(destino, 'Dos Tres')).isSymbolicLink());
  assert.equal(readlinkSync(join(destino, 'Dos Tres')), proyectos[0].ruta);
  assert.ok(!lstatSync(join(destino, 'Uno')).isSymbolicLink());
  const r2 = enlazarProyectos({ proyectos, destino });
  assert.deepEqual(r2.creados, []);
  assert.deepEqual(r2.existentes, ['Dos Tres']);
});
