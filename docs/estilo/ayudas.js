import { alternar, puedeAbrir } from './ayudas-logica.js';

const CLAVE = 'ayudas:' + location.pathname;
let guardado = {};
try { guardado = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) {}

function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(guardado)); } catch (e) {}
}

for (const ejercicio of document.querySelectorAll('[data-ejercicio]')) {
  const id = ejercicio.dataset.ejercicio;
  const contenedor = ejercicio.querySelector('.ayuda-botones');
  const botones = [...contenedor.querySelectorAll('button')];
  const ayudas = [...ejercicio.querySelectorAll('.ayuda')];
  let abiertas = new Set(guardado[id] || []);
  contenedor.hidden = false;

  function pintar() {
    ayudas.forEach((a, i) => a.classList.toggle('abierta', abiertas.has(i)));
    botones.forEach((b, i) => {
      b.disabled = !puedeAbrir(abiertas, i) && !abiertas.has(i);
      b.setAttribute('aria-expanded', String(abiertas.has(i)));
      b.classList.toggle('activo', abiertas.has(i));
    });
  }

  botones.forEach((b, i) => {
    b.addEventListener('click', () => {
      abiertas = alternar(abiertas, i, ayudas.length);
      guardado[id] = [...abiertas];
      guardar();
      pintar();
    });
  });
  pintar();
}
