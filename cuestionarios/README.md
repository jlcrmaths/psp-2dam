# Cuestionario de repaso – Unidad 1 (Moodle)

Archivo: `repaso-u1-moodle.xml` (162 preguntas, 10 categorías). Se genera con `node cuestionarios/generar-cuestionario.mjs`.

Las preguntas usan **otros contextos distintos de los ejercicios** (taller, cobertizo, cabina de fotos, muelle, peluquería…): son las mismas ideas, pero no se pueden contestar de memoria recordando el ejercicio. Siguen las presentaciones de `contenido/u1/*/presentacion.md` (mismo vocabulario: «cerrojo», «recurso compartido», «señal de fin») y las «Preguntas» de cada enunciado.

## Presentación para repasar en clase
`repaso-u1-presentacion.html`: 162 preguntas, cada una con su diapositiva de pregunta y la siguiente con la respuesta y la explicación (335 diapositivas). Se abre en el navegador (necesita internet para cargar reveal.js). Flechas para avanzar, `O` para el índice, `F` para pantalla completa. Las opciones salen barajadas, igual siempre.

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

## Qué bloque mide cada criterio (programación 2026-27, RA2 hilos)
Fuente: `2_DAM_PSP_2627_v02`. RA2: 50% tareas + 50% prueba. Los criterios de **RA1** (procesos, tuberías) y **2.h** (depurar y documentar) se evalúan 100% en la empresa.

| Categoría del banco | Criterios RA2 que mide |
|---|---|
| 6.1 Crear hilos | 2.a, 2.b, 2.c, 2.j |
| 6.2 Prioridades | 2.g |
| 6.3 Información compartida | 2.e, 2.k |
| 6.4 Comunicar hilos | 2.e, 2.f |
| 6.5 Lectores y escritores (y semáforo/ficheros) | 2.e, 2.f, 2.k |
| 6.6 Problemas de sincronización | 2.a, 2.f, 2.k |
| 6.8 Interbloqueo | 2.d (`getState()`), 2.f, 2.k |
| Simulacro de examen | mezcla de 2.c, 2.e, 2.f, 2.k |

**Criterio por pregunta:** desde el 2026-11-10 cada pregunta (menos 5.4) lleva su criterio en el nombre (`[2.k] 6.8-144 …`) y como etiqueta de Moodle. La asignación está en `CRITERIOS` dentro de `generar-cuestionario.mjs`. Preguntas por criterio: 2.a 4 · 2.b 8 · 2.c 24 · 2.d 7 · 2.e 21 · 2.f 44 · 2.g 8 · 2.i 7 · 2.j 12 · 2.k 27. La categoría «Refuerzo: cuándo usar hilos y estados» (RF-173 a RF-180) cubre 2.a y 2.d.

## Examen del jueves en Moodle (nota por criterio)
Archivo: `examen-jueves-moodle.xml` (18 preguntas, 10 puntos). Se genera con `node cuestionarios/generar-examen-moodle.mjs`. Mismo contenido y puntos que `privado/u1/examen/examen.html`.

- Importar: Banco de preguntas → Importar → Moodle XML. Categoría `Examen PSP Unidad 1 (hilos)`.
- Cada pregunta mide **un** criterio RA2. Va en el nombre (`[2.e] E15 Heladería`) y como **etiqueta** (`2.e`, más `examen-u1`).
- Cuestionario: añadir las 18 preguntas en orden. Sin mezclar preguntas (el test va primero). Un solo intento, sin explicación al alumno hasta cerrar.
- Las 5 preguntas de redacción (salida sin join, heladería, taquilla, interbloqueo y estantería) se corrigen a mano: la solución y el reparto de puntos salen en «información para el corrector». Califica cada una con su nota parcial (0,15 por fallo, etc.).
- **Nota por criterio:** Resultados → Calificaciones → descargar Excel. Hay una columna por pregunta (con el criterio en el nombre). Suma las columnas con el mismo criterio. Máximos: 2.a 0,25 · 2.b 0,5 · 2.c 1,5 · 2.d 0,25 · 2.e 2 · 2.f 2 · 2.g 0,25 · 2.i 1 · 2.j 1 · 2.k 1,25.
- Para filtrar por criterio en el banco: filtro por etiqueta.
