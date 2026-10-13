# Apartado 6.3 – Información compartida entre hilos

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `jardines`.

## Ejercicio 1: el problema de los jardines (proyecto `ProblemaJardines`)

Un jardín tiene al principio 100 personas. Entran 10 personas y salen otras 10, todas a la vez, cada una como un hilo distinto. Al final tendría que haber otra vez 100 personas.

El programa espera a que acaben los 20 hilos y muestra `Personas en el jardín: ` seguido de la cuenta final.

Ejecuta el programa varias veces. Mira si sale 100 y fíjate también en los mensajes de cada hilo.

### Pistas
El jardín es algo que comparten los 20 hilos, así que necesita su propia clase y todos los hilos reciben el mismo objeto. Hacen falta dos tipos de hilo: uno que suma 1 y otro que resta 1. Para que `main` muestre el resultado cuando todos han terminado, tiene que esperar a cada hilo. Fíjate en que sumar 1 a una variable no es un solo paso para el ordenador.

### Más ayuda
Crea una clase `RecursoJardin` con un atributo `int` que empiece en 100 y dos métodos: `incrementaCuenta` y `decrementaCuenta`. Cada método muestra qué hilo entra o sale (con `Thread.currentThread().getName()`), suma o resta 1 a la cuenta con `cuenta++` o `cuenta--` y muestra la cuenta. Las clases `EntraJardin` y `SaleJardin` implementan `Runnable`, reciben el jardín en el constructor y llaman a su método en `run()`. En `Principal`, crea un solo jardín y un `ArrayList<Thread>`. Con un `for` de 10 vueltas, añade en cada una un hilo que entra y otro que sale. Arranca todos con `start()` en un segundo bucle y espera a todos con `join()` en un tercero. Añade `throws InterruptedException` a `main`.

### Paso a paso
1. Crea el proyecto `ProblemaJardines` y el paquete `jardines`.
2. Crea la clase `RecursoJardin` con un atributo privado `int` llamado `cuenta`, que empiece en 100 en el constructor.
3. Añade un método `getCuenta` que devuelva la cuenta.
4. Escribe `incrementaCuenta`. Muestra `hilo ` + el nombre del hilo + ` ----- Entra en Jardín`.
5. Suma 1 con `cuenta++`.
6. Muestra `cuenta` + ` en jardín`.
7. Escribe `decrementaCuenta` igual, pero con `Sale de Jardín` y `cuenta--`.
8. Crea la clase `EntraJardin`, que implementa `Runnable`, guarda el jardín en un atributo recibido por el constructor y llama a `incrementaCuenta()` en `run()`.
9. Crea la clase `SaleJardin` igual, pero llamando a `decrementaCuenta()`.
10. En `Principal`, crea un solo `RecursoJardin` y un `ArrayList<Thread>`.
11. Con un `for` de 1 a 10, añade a la lista un hilo con `EntraJardin` ("Entra1"...) y otro con `SaleJardin` ("Sale1"...).
12. Con un `for` de tipo «para cada hilo de la lista», arranca todos con `start()`.
13. Con otro igual, llama a `join()` en cada hilo. Añade `throws InterruptedException` a `main`.
14. Muestra `Personas en el jardín: ` y la cuenta. Ejecútalo varias veces.

## Ejercicio 2: los jardines sincronizados (proyecto `JardinesSincronizado`)

Es el mismo programa del ejercicio 1: 100 personas, 10 entran y 10 salen a la vez. Pero ahora el resultado tiene que ser siempre el correcto.

Al final se muestra `Personas en el jardín: 100`, en todas las ejecuciones.

### Pistas
No hay que cambiar los hilos ni `Principal`. El problema está dentro del jardín: dos hilos están a la vez en el mismo método. Java tiene una palabra clave que deja entrar a un solo hilo cada vez en un método; los demás esperan fuera. Piensa en qué métodos tienes que ponérsela.

### Más ayuda
Copia el proyecto del ejercicio 1 y cambia solo `RecursoJardin`. Añade la palabra `synchronized` a la declaración de `incrementaCuenta` y también a la de `decrementaCuenta`. Con una sola no basta: un hilo que entra y otro que sale también se pisarían entre ellos, porque tocan la misma variable. Con los dos métodos `synchronized`, el jardín actúa como una puerta de una sola persona: mientras un hilo está dentro de cualquiera de los dos, los otros 19 esperan.

### Paso a paso
1. Crea el proyecto `JardinesSincronizado` y el paquete `jardines`.
2. Copia en él las cuatro clases del ejercicio 1: `RecursoJardin`, `EntraJardin`, `SaleJardin` y `Principal`.
3. En `RecursoJardin`, añade `synchronized` entre `public` y `void` en `incrementaCuenta`.
4. Haz lo mismo en `decrementaCuenta`.
5. Ejecuta el programa varias veces y comprueba que siempre sale 100.
6. Fíjate en el registro: ahora cada hilo muestra su línea y su cuenta seguidas, sin mezclarse con las de otros.

## Preguntas

1. Ejecuta el ejercicio varias veces. ¿Sale 100? ¿Tienen sentido los mensajes de los hilos? ¿Qué números raros ves en `en jardín`?
2. Si hoy ha salido 100, ¿significa que el programa es correcto? ¿Podría fallar en otro ordenador o en otra ejecución?
3. Dos hilos leen la cuenta a la vez (100) y los dos guardan 101. ¿Cuántas personas han entrado? ¿Cuántas cuenta el programa?
4. ¿Cómo evitarías que dos hilos estén a la vez dentro de `incrementaCuenta`? (Lo haces en el ejercicio 2.)
5. En el ejercicio 2, ¿por qué hay que poner `synchronized` también en `decrementaCuenta`?
6. ¿Qué se ha perdido a cambio de que el resultado sea correcto? (Pista: los hilos ya no trabajan a la vez dentro del jardín.)
