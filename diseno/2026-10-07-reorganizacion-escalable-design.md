# Reorganización escalable del material de PSP

Fecha: 2026-10-07. Estado: pendiente de revisión.

## Objetivo

Que añadir un ejercicio, un apartado o una unidad nueva cueste poco y no rompa nada, aunque el número de unidades sea desconocido. Todo el material es de PSP (2º DAM). El autor es un profesor sustituto que parte de cero en Java; Claude escribe y mantiene las fuentes y el generador.

Criterios de éxito:
- Un cambio de estilo se hace en un solo archivo.
- Añadir una carpeta de apartado lo añade al índice sin editar nada más.
- Lo que se muestra en las diapositivas coincide siempre con el código que compila.
- Las notas del profesor no son legibles sin el código de acceso, ni en la web ni en el repo.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Alcance | Solo PSP, número de unidades desconocido |
| Mantenimiento | Fuentes pequeñas y un generador propio en Node (`construir.mjs`) |
| Publicación | HTML generado en `docs/`, servido por GitHub Pages |
| Estilo | Claro: azul limpio (B). Oscuro: editor oscuro verde (C). Automático según el sistema, con botón para forzarlo |
| Enunciados | Tres ayudas por ejercicio (ligera, más ayuda, paso a paso), en palabras y sin código. Sin solución en la página |
| Notas del profesor | Cifradas con AES-256-GCM. Fuentes fuera del repo |
| Historial de git | Las notas de 6.1 ya subidas se aceptan como públicas. No se reescribe el historial |

## Estructura de carpetas

```
PSP/
  estilo/                 tema.css, plantillas, scripts de ayudas, glosario y cifrado
  contenido/              fuentes (en el repo)
    u1/
      6.1-crear-hilos/
        apartado.json     título, orden, resumen
        enunciado.md      ejercicios con sus ayudas
        presentacion.md   diapositivas
        proyectos/        proyectos Java (CrearHilos, CincoPerrosGatos...)
  glosario/               una ficha .md por término
  privado/                NO se sube. notas-profesor.md por apartado
  material-profesor/      NO se sube. Material original del profesor
  diseno/                 especificaciones
  docs/                   salida generada, servida por Pages
  construir.mjs           generador
```

`docs/` pasa a ser solo salida generada: se puede borrar y regenerar. Los documentos de diseño van en `diseno/` para no mezclarlos con ella. En GitHub hay que cambiar una vez Settings → Pages a la carpeta `/docs`. La URL no cambia.

## Formato de las fuentes

**`apartado.json`:** título, número de orden, resumen de una línea.

**`enunciado.md`:** un título de nivel 2 por ejercicio. Debajo, el texto del ejercicio y tres subtítulos de nivel 3 obligatorios: `Ayuda ligera`, `Más ayuda`, `Paso a paso`. Las ayudas nombran clases, métodos y comandos, pero no incluyen líneas de código.

**`presentacion.md`:** diapositivas separadas por una línea `---`, subdiapositivas verticales por `--`. El código se incluye con `{{codigo: CincoPerrosGatos/Principal.java}}` y el generador lo copia del proyecto real. Se admiten rangos de líneas para resaltarlas.

**Ficha de glosario** (`glosario/<termino>.md`): cabecera con `nombre` y los campos *Qué es*, *Para qué sirve* y *Ejemplo mínimo*. Un término = un archivo. Un término duplicado es un error de construcción.

**Notas del profesor** (`privado/u1/<apartado>/notas-profesor.md`): Markdown libre. Es la única fuente que no está en el repo.

## Generador

`construir.mjs` (Node 22, dependencia `marked`):
1. Recorre `contenido/` y `glosario/`.
2. Genera en `docs/`: índice, enunciados con ayudas, presentaciones reveal.js, glosario ordenado con buscador, notas cifradas.
3. Falla con mensaje claro si: hay un término duplicado; un `{{codigo: ...}}` apunta a un archivo inexistente; un ejercicio no tiene sus tres ayudas; falta `apartado.json`.

El índice se genera a partir de las carpetas, ordenadas por `apartado.json`. Las notas llevan icono de candado.

## Estilo

Un `estilo/tema.css` con variables (colores, tipografía, radios, cajas `caja`, `aviso`, `salida`). Lo cargan todas las páginas, incluidas las presentaciones, que sustituyen el tema `white` de reveal.js por los mismos dos temas. Tipografía del sistema, código en monoespaciada del sistema, sin fuentes descargadas.

## Ayudas en los enunciados

- Tres botones por ejercicio, que se abren en orden: la segunda no se puede abrir hasta abrir la primera.
- Cada ayuda abierta queda visible; un botón la cierra.
- El estado se guarda en el navegador del alumno (`localStorage`, dentro de `try/catch`) y no se envía a ningún sitio.
- Sin JavaScript, todas las ayudas se muestran desplegadas.

## Notas cifradas

- Cifrado AES-256-GCM. La clave se obtiene de la frase con PBKDF2 con muchas iteraciones.
- El HTML publicado contiene la pantalla de acceso y el texto cifrado. El navegador descifra con WebCrypto. Con una frase incorrecta se muestra un error y no se revela nada.
- La frase no se guarda en ningún archivo del repo. El script la pide al ejecutarse o la lee de una variable de entorno local. Se recomienda una frase de cuatro palabras o más.
- `privado/` debe incluirse en la copia de seguridad del usuario. Sin las fuentes, las notas ya publicadas no se pueden editar.

## Flujo de trabajo

1. El usuario deja material nuevo en `material-profesor/tema-1/ejercicios/`.
2. Claude crea el proyecto Java, escribe enunciado y ayudas, diapositivas, notas y fichas de glosario, y ejecuta `node construir.mjs`.
3. Claude compila los proyectos Java y revisa las páginas generadas en el navegador.
4. Claude informa de los cambios. Commit y push con el consentimiento ya acordado.

## Comprobaciones

- Cada proyecto Java compila y se ejecuta.
- `construir.mjs` termina sin errores.
- Las páginas se abren sin errores en la consola del navegador, en modo claro y oscuro.
- Las notas no se descifran con una frase incorrecta y sí con la correcta.
- Las ayudas respetan el orden de apertura.

## Migración de 6.1

Se convierte 6.1 al nuevo formato antes de añadir material. Los proyectos Java se mueven a `contenido/u1/6.1-crear-hilos/proyectos/`. Las ayudas de los cuatro ejercicios las escribe Claude y las revisa el usuario. Las URL de la web cambian (`clases/6.1-crear-hilos/...` pasa a `u1/6.1-crear-hilos/...`). Se actualizan el `.gitignore` y las skills `preparar-clase-psp` y `tutor-java-psp` para que sigan el nuevo flujo.

## Fuera de alcance

Buscador global, varias versiones de curso, modo de impresión, CI en la nube.
