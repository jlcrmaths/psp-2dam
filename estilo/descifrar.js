function deBase64(texto) {
  return Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));
}

export async function descifrar(paquete, frase) {
  const material = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(frase), 'PBKDF2', false, ['deriveKey'],
  );
  const clave = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: deBase64(paquete.sal), iterations: paquete.it, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
  const plano = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: deBase64(paquete.iv) }, clave, deBase64(paquete.datos),
  );
  return new TextDecoder().decode(plano);
}
