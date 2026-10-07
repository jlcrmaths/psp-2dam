# Notas del profesor – 6.1 Crear hilos

Código en dos proyectos, con el estilo del profesor (sin comentarios en el código):
- `CrearHilos/src/crearhilos/`: `Contador.java`, `Principal.java`
- `EjemploPerrosGatos/src/crearhilos/`: `Gato.java`, `Perro.java`, `Principal.java`

## Cómo está construido
- **Un archivo por clase**, todo en el paquete `crearhilos`.
- **`Runnable`:** `Contador`, `Gato` y `Perro` solo implementan `run()`. No son hilos por sí solas. El hilo es el objeto `Thread` de `Principal`.
- **`new Thread(new Contador(), "Hilo 1")`:** el segundo argumento es el nombre del hilo.
- **`Thread.currentThread().getName()`:** `Contador` no sabe qué hilo es. Le pregunta a Java quién la está ejecutando. Por eso las tres copias usan la misma clase y dan `Hilo 1`, `Hilo 2` y `Hilo 3`.
- **`start()`:** va después de crear los tres hilos. Crea el hilo y llama a `run()`.
- **Sin `join()`.** Cada ejercicio es un proyecto aparte, así que las salidas no se mezclan.

## Puntos a explicar
- Un hilo es un objeto `Thread`. El código del hilo está en `run()`.
- Dos formas de crear hilos: extender `Thread` o implementar `Runnable`. Aquí se usa `Runnable`. Es la más general: sirve aunque la clase ya herede de otra.
- Siempre existe un hilo `main`. Es el último en terminar el programa.
- El orden de la salida **no es fijo**. Ejecutar el ejercicio 1 varias veces y comparar. Es la primera idea de concurrencia.

## Errores típicos de los alumnos
1. **`run()` en vez de `start()`.** Todo corre en `main`, en orden, sin concurrencia. El nombre que sale es `main`, no `Hilo 1`. Es la pista para detectarlo.
2. **`start()` dos veces** sobre el mismo hilo: `IllegalThreadStateException`.
3. **`new Thread(new Contador())` sin nombre.** Java pone `Thread-0`, `Thread-1`... y la salida no es `Hilo x: y`.
4. **Pasar la clase `Runnable` a `start()`.** Solo `Thread` tiene `start()`. Hay que envolver el `Contador` en un `Thread`.
5. **Escribir mal `run`** (`Run`, `run(int x)`). No sobrescribe el método. `@Override` hace que el compilador avise.
6. **Esperar una salida ordenada** (`Hilo 1` entero, luego `Hilo 2`...). Se mezclan y varían entre ejecuciones. A veces un hilo termina sus 10 pasos antes de que arranque otro. No es un fallo.
7. **Un solo bucle en `main`** para "simular" los hilos. No son hilos.
8. **Pensar que `Miau!` sale siempre primero** por lanzarse antes. El orden de ejecución lo decide el sistema.
9. **Mezclar las dos clases `Principal`.** Están en proyectos distintos. Abrir el proyecto correcto antes de ejecutar.

## Pregunta de cierre
Ejecutar 5 veces el ejercicio 2. ¿Cambia el orden? ¿Por qué? (Respuesta: lo decide el planificador del sistema. Con tan poco trabajo casi siempre sale igual, pero no está garantizado.)
