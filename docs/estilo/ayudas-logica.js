export function puedeAbrir(abiertas, i) {
  return i === 0 || abiertas.has(i - 1);
}

export function alternar(abiertas, i, total) {
  const nuevo = new Set(abiertas);
  if (nuevo.has(i)) {
    for (let j = i; j < total; j++) nuevo.delete(j);
  } else if (puedeAbrir(nuevo, i)) {
    nuevo.add(i);
  }
  return nuevo;
}
