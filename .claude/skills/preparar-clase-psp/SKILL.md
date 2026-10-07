---
name: preparar-clase-psp
description: Prepara una clase de PSP (2º DAM) a partir de un apartado de la unidad: ejercicio con solución en Java, notas para el profesor y una presentación HTML con reveal.js. Úsalo cuando el usuario pida preparar una clase o un ejercicio.
---

Antes de crear nada, lee el material de la carpeta material-profesor (teoría e imágenes de ejercicios resueltos) para imitar el estilo del profesor al que sustituyo.

Para el apartado que te pida, genera en la carpeta clases/<apartado>/:
1. enunciado.md: enunciado claro para los alumnos.
2. Proyectos NetBeans con las clases de la solución, siguiendo la sección "Estilo del profesor". Si las imágenes de material-profesor muestran algo distinto a la sección Estilo del profesor, avísame y pregúntame cuál seguir.
3. notas-profesor.md: errores típicos de los alumnos y puntos a explicar.
4. presentacion.html: presentación con reveal.js (cargado desde CDN) con estas diapositivas: objetivo, teoría breve, ejemplo, enunciado del ejercicio y solución.

Usa lenguaje sencillo y ejemplos pequeños.

Estilo del profesor (obligatorio):
- Un archivo .java por clase, en un paquete en minúsculas (por ejemplo crearhilos).
- Cada ejercicio en su propia carpeta de proyecto NetBeans, con nombre en español (por ejemplo CrearHilos, EjemploPerrosGatos), con la estructura src/<paquete>/.
- La clase con el main se llama Principal.
- En ejercicios de hilos, usa Runnable con new Thread(new Clase(), "Hilo 1"). Esto solo se aplica a ejercicios de hilos. En los demás apartados (repaso de Java, procesos) se mantiene el resto del estilo: un archivo por clase, proyecto propio, clase Principal, sin comentarios.
- Variables con nombres cortos.
- Sin comentarios dentro del código. Las explicaciones van en notas-profesor.md.
- En ejercicios de hilos, la salida por pantalla usa Thread.currentThread().getName(). En los demás apartados, la salida se muestra con System.out.println normal.

Glosario y explicaciones:
- Cada vez que prepares una clase, añade a PSP/glosario/glosario.html las clases, métodos o palabras clave nuevas que aparezcan, sin duplicar las que ya estén.
- En los primeros ejemplos de cada apartado, la presentación debe explicar el código paso a paso, línea por línea, con lenguaje sencillo.
