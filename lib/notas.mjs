import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { escapar } from './md.mjs';
import { pagina } from './pagina.mjs';

export const ITERACIONES = 600000;

export function cifrar(texto, frase, iteraciones = ITERACIONES) {
  const sal = randomBytes(16);
  const iv = randomBytes(12);
  const clave = pbkdf2Sync(frase, sal, iteraciones, 32, 'sha256');
  const cifrador = createCipheriv('aes-256-gcm', clave, iv);
  const cifrado = Buffer.concat([cifrador.update(texto, 'utf8'), cifrador.final()]);
  const etiqueta = cifrador.getAuthTag();
  return {
    v: 1,
    it: iteraciones,
    sal: sal.toString('base64'),
    iv: iv.toString('base64'),
    datos: Buffer.concat([cifrado, etiqueta]).toString('base64'),
  };
}

export function paginaNotas({ titulo, paquete, base }) {
  return pagina({
    titulo: `Notas del profesor · ${titulo}`,
    base,
    scripts: ['estilo/acceso.js'],
    cuerpo: `<h1>Notas del profesor</h1>
<p class="suave">${escapar(titulo)}</p>
<form id="acceso" class="tarjeta acceso">
<label>Código de acceso<input name="frase" type="password" autocomplete="off" required></label>
<button class="boton" type="submit">Entrar</button>
</form>
<p id="error" class="aviso" hidden>Código incorrecto.</p>
<div id="notas" class="notas"></div>
<script type="application/json" id="paquete">${JSON.stringify(paquete)}</script>`,
  });
}
