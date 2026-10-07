const buscar = document.getElementById('buscar');
const fichas = document.querySelectorAll('.ficha');
const vacio = document.getElementById('vacio');

buscar.addEventListener('input', () => {
  const q = buscar.value.toLowerCase();
  let visibles = 0;
  fichas.forEach((f) => {
    const coincide = f.textContent.toLowerCase().includes(q);
    f.hidden = !coincide;
    if (coincide) visibles++;
  });
  vacio.hidden = visibles > 0;
});
