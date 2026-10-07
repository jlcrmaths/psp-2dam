const boton = document.getElementById('tema');

function actual() {
  const forzado = document.documentElement.getAttribute('data-tema');
  if (forzado) return forzado;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

if (boton) {
  boton.addEventListener('click', () => {
    const nuevo = actual() === 'oscuro' ? 'claro' : 'oscuro';
    document.documentElement.setAttribute('data-tema', nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) {}
  });
}
