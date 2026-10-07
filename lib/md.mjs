import { marked } from 'marked';

export function md(texto) {
  return marked.parse(texto, { async: false, gfm: true });
}

export function mdLinea(texto) {
  return marked.parseInline(texto, { async: false });
}

export function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
