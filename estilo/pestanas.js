// Pestañas de unidad en el índice. Sin JS se ven todas las unidades.
const botones = [...document.querySelectorAll('.pestana')];
const paneles = [...document.querySelectorAll('.panel-unidad')];

function mostrar(id) {
  if (!paneles.some((p) => p.id === id)) id = paneles[0] && paneles[0].id;
  for (const b of botones) b.setAttribute('aria-selected', String(b.dataset.unidad === id));
  for (const p of paneles) p.hidden = p.id !== id;
  try { localStorage.setItem('unidad', id); } catch (e) {}
}

let inicial = location.hash.slice(1);
if (!inicial) { try { inicial = localStorage.getItem('unidad'); } catch (e) {} }
mostrar(inicial);
for (const b of botones) {
  b.addEventListener('click', () => { mostrar(b.dataset.unidad); history.replaceState(null, '', '#' + b.dataset.unidad); });
}
