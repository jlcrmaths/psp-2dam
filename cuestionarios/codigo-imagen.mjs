// Convierte un bloque de código Java en PNG (resaltado de sintaxis, números de línea, fondo con trama).
// Usa Chrome en modo headless. Uso: import { codigoAPng } from './codigo-imagen.mjs'
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const KW = new Set(('abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch synchronized this throw throws try void volatile while true false var').split(' '));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function resaltar(linea) {
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)')|(@\w+)|(\b\d+(?:\.\d+)?[LlDdFf]?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;
  let o = '', m;
  while ((m = re.exec(linea))) {
    if (m[1]) o += `<i class=c>${esc(m[1])}</i>`;
    else if (m[2] || m[3]) o += `<i class=s>${esc(m[0])}</i>`;
    else if (m[4]) o += `<i class=a>${esc(m[0])}</i>`;
    else if (m[5]) o += `<i class=n>${esc(m[0])}</i>`;
    else if (m[6]) o += KW.has(m[0]) ? `<i class=k>${m[0]}</i>` : /^[A-Z]/.test(m[0]) ? `<i class=t>${m[0]}</i>` : esc(m[0]);
    else o += esc(m[0]);
  }
  return o;
}

const FONDOS = {
  diagonal: 'repeating-linear-gradient(45deg, rgba(60,80,120,.07) 0 1px, transparent 1px 7px), #fbfcfe',
  puntos: 'radial-gradient(rgba(60,80,120,.16) 1px, transparent 1.2px) 0 0/9px 9px, #fbfcfe',
  cuadricula: 'linear-gradient(rgba(60,80,120,.07) 1px, transparent 1px) 0 0/11px 11px, linear-gradient(90deg, rgba(60,80,120,.07) 1px, transparent 1px) 0 0/11px 11px, #fbfcfe',
};

export function codigoAPng(codigo, salida, fondo = 'diagonal') {
  const lineas = codigo.replace(/\t/g, '    ').replace(/\s+$/, '').split('\n');
  const FS = 15, CH = 9.03, LH = 22, PAD = 16, NUM = 34;
  const ancho = Math.ceil(Math.max(...lineas.map((l) => l.length)) * CH + NUM + PAD * 2 + 6);
  const alto = lineas.length * LH + PAD * 2;
  const filas = lineas.map((l, i) => `<div class=l><b>${i + 1}</b>${resaltar(l) || ' '}</div>`).join('');
  const html = `<!doctype html><meta charset=utf-8><style>
html,body{margin:0;background:#fff}
#c{width:${ancho}px;height:${alto}px;box-sizing:border-box;padding:${PAD}px;background:${FONDOS[fondo]};border:1px solid #c9d1e0;
font:${FS}px/${LH}px Menlo,"DejaVu Sans Mono",monospace;color:#1f2430;white-space:pre;overflow:hidden}
.l{height:${LH}px}.l b{display:inline-block;width:${NUM}px;color:#8a93a6;font-weight:400;user-select:none}
i{font-style:normal}.k{color:#a626a4;font-weight:600}.t{color:#0b6e99}.s{color:#c2410c}.n{color:#0d7a4a}.a{color:#9a6700}.c{color:#6b7280}
</style><div id=c>${filas}</div>`;
  const dir = mkdtempSync(join(tmpdir(), 'cod-'));
  const f = join(dir, 'c.html');
  writeFileSync(f, html);
  if (!existsSync(CHROME)) throw new Error('Chrome no encontrado: ' + CHROME);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
    `--window-size=${ancho},${alto}`, `--screenshot=${salida}`, 'file://' + f], { stdio: 'ignore' });
  return { ancho, alto };
}
