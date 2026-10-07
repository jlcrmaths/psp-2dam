---
name: preparar-clase-psp
description: Prepara una clase de PSP (2º DAM) a partir de un apartado de la unidad: ejercicio con solución en Java, notas para el profesor y una presentación HTML con reveal.js. Úsalo cuando el usuario pida preparar una clase o un ejercicio.
---

Antes de crear nada, lee el material de la carpeta material-profesor (teoría e imágenes de ejercicios resueltos) para imitar el estilo del profesor al que sustituyo.

Para el apartado que te pida, escribe las fuentes (el HTML lo genera construir.mjs, nunca se escribe a mano):
1. contenido/<unidad>/<apartado>/enunciado.md: enunciado claro para los alumnos. Cada ejercicio es un título "## Ejercicio N: ..." con su texto y tres subtítulos obligatorios: "### Ayuda ligera", "### Más ayuda" y "### Paso a paso". Las ayudas usan solo palabras (nombran clases, métodos y comandos, pero sin bloques de código) y nunca incluyen la solución completa. El generador falla si falta una ayuda o si una lleva código.
2. contenido/<unidad>/<apartado>/proyectos/: proyectos NetBeans con las clases de la solución, siguiendo la sección "Estilo del profesor". Si las imágenes de material-profesor muestran algo distinto a la sección Estilo del profesor, avísame y pregúntame cuál seguir.
3. contenido/<unidad>/<apartado>/presentacion.md: diapositivas con reveal.js (objetivo, teoría breve, ejemplo, enunciado del ejercicio y solución). "---" separa diapositivas y "--" subdiapositivas verticales. Cuando una diapositiva muestre un archivo completo, usa {{codigo: Proyecto/Archivo.java}} (opcional ":: 5-12" para un rango y "@@ 1|3-4" para resaltar líneas paso a paso). Una diapositiva que empiece por <!-- html --> se inserta tal cual, sin pasar por Markdown.
4. privado/<unidad>/<apartado>/notas-profesor.md: errores típicos de los alumnos y puntos a explicar. La carpeta privado/ no va a git: el generador publica las notas cifradas con la variable de entorno PSP_FRASE, que define el usuario. No guardes la frase en ningún archivo.
5. glosario/<termino>.md: una ficha por término nuevo, con la cabecera "nombre: ..." y los campos "## Qué es", "## Para qué sirve" y "## Ejemplo mínimo".
6. contenido/<unidad>/<apartado>/apartado.json (titulo, orden, resumen) y, si la unidad es nueva, contenido/<unidad>/unidad.json (titulo, orden).

Después de escribir las fuentes, ejecuta "node --test" y "PSP_FRASE=... node construir.mjs", compila los proyectos con javac y revisa docs/ en el navegador antes de dar nada por hecho.

Usa lenguaje sencillo y ejemplos pequeños.

Estilo del profesor (obligatorio):
- Un archivo .java por clase, en un paquete en minúsculas (por ejemplo crearhilos).
- Cada ejercicio en su propia carpeta de proyecto NetBeans, con nombre en español (por ejemplo CrearHilos, EjemploPerrosGatos), con la estructura src/<paquete>/.
- La clase con el main se llama Principal.
- En ejercicios de hilos, usa Runnable con new Thread(new Clase(), "Hilo 1"). Esto solo se aplica a ejercicios de hilos. En los demás apartados (repaso de Java, procesos) se mantiene el resto del estilo: un archivo por clase, proyecto propio, clase Principal, sin comentarios.
- Variables con nombres cortos.
- Sin comentarios dentro del código. Las explicaciones van en las notas del profesor (privado/.../notas-profesor.md).
- En ejercicios de hilos, la salida por pantalla usa Thread.currentThread().getName(). En los demás apartados, la salida se muestra con System.out.println normal.

Glosario y explicaciones:
- Cada vez que prepares una clase, crea una ficha en glosario/ por cada clase, método o palabra clave nueva que aparezca. El generador falla si un término está duplicado (sin distinguir mayúsculas).
- En los primeros ejemplos de cada apartado, la presentación debe explicar el código paso a paso, línea por línea, con lenguaje sencillo.
