import { descifrar } from './descifrar.js';

const paquete = JSON.parse(document.getElementById('paquete').textContent);
const formulario = document.getElementById('acceso');
const error = document.getElementById('error');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  error.hidden = true;
  try {
    const html = await descifrar(paquete, formulario.elements.frase.value);
    document.getElementById('notas').innerHTML = html;
    formulario.hidden = true;
  } catch (e) {
    error.hidden = false;
  }
});
