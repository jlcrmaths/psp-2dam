# Cuestionario de repaso – Unidad 1 (Moodle)

Archivo: `repaso-u1-moodle.xml` (149 preguntas, 9 categorías). Se genera con `node cuestionarios/generar-cuestionario.mjs`.

Las preguntas usan **otros contextos distintos de los ejercicios** (taller, cobertizo, cabina de fotos, muelle, peluquería…): son las mismas ideas, pero no se pueden contestar de memoria recordando el ejercicio. Siguen las presentaciones de `contenido/u1/*/presentacion.md` (mismo vocabulario: «cerrojo», «recurso compartido», «señal de fin») y las «Preguntas» de cada enunciado.

## Presentación para repasar en clase
`repaso-u1-presentacion.html`: 149 preguntas, cada una con su diapositiva de pregunta y la siguiente con la respuesta y la explicación (308 diapositivas). Se abre en el navegador (necesita internet para cargar reveal.js). Flechas para avanzar, `O` para el índice, `F` para pantalla completa. Las opciones salen barajadas, igual siempre.

## Importar
1. Curso → Banco de preguntas → Importar.
2. Formato: **Formato Moodle XML**. Elegir el archivo. Dejar «Obtener categoría desde el archivo» activado.
3. Se crea `Repaso PSP Unidad 1` con una subcategoría por apartado (6.1 a 6.8) y el simulacro.

## Montar el cuestionario
- Un cuestionario por apartado: añadir «preguntas aleatorias» de cada categoría, o todas.
- Comportamiento: **interactivo con varios intentos** (o «adaptativo») para que el alumno vea la explicación al fallar.
- Mezclar preguntas y respuestas: sí (ya está activado en las preguntas).
- El simulacro: añadir solo la categoría «Simulacro de examen». Tiene 4 preguntas de redacción: se corrigen a mano.
- Las 4 preguntas de redacción llevan la solución de ejemplo en la información para el corrector.

## Tipos de pregunta incluidos
| Tipo | Uso |
|---|---|
| Opción múltiple (una / varias) | teoría y detectar fallos en código |
| Verdadero/Falso | conceptos clave |
| Emparejar | método ↔ función, síntoma ↔ causa, problema ↔ proyecto |
| Arrastrar al texto | completar código y **ordenar** líneas o pasos |
| Seleccionar palabras que faltan | desplegables dentro del código |
| Cloze (respuestas incrustadas) | escribir lo que falta en el código; distingue mayúsculas |
| Respuesta corta | predecir la salida, nombre de una excepción |
| Numérica | contar hilos, líneas, precios |
| Redacción | escribir clases completas |
