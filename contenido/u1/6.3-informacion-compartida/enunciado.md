# Apartado 6.3 – Información compartida entre hilos

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `jardines`.

## Ejercicio 1: el problema de los jardines (proyecto `ProblemaJardines`)

Un jardín tiene al principio 100 personas. Entran 1000 personas y salen otras 1000, todas a la vez, cada una como un hilo distinto. Al final tendría que haber otra vez 100 personas.

Cada hilo muestra su nombre y cuántas personas hay en el jardín. El último mensaje debería decir `100 en jardín`.

Ejecuta el programa varias veces. Mira qué dice el último mensaje y fíjate también en el resto del registro.

### Pistas
El jardín es algo que comparten los 2000 hilos, así que necesita su propia clase y todos los hilos reciben el mismo objeto. Hacen falta dos tipos de hilo: uno que suma 1 y otro que resta 1. Cada hilo muestra la cuenta, así que el resultado se lee en el registro. Fíjate en que sumar 1 a una variable no es un solo paso para el ordenador.

### Más ayuda
Crea una clase `RecursoJardin` con un atributo `int` que empiece en 100 y dos métodos: `incrementaCuenta` y `decrementaCuenta`. Cada método muestra qué hilo entra o sale (con `Thread.currentThread().getName()`), suma o resta 1 a la cuenta con `cuenta++` o `cuenta--` y muestra la cuenta. Las clases `EntraJardin` y `SaleJardin` implementan `Runnable`, reciben el jardín en el constructor y llaman a su método en `run()`. En `Principal`, crea un solo jardín. Con un `for` de 1000 vueltas, crea y arranca en cada una un hilo que entra, con `new Thread(new EntraJardin(jardin), "Entra" + i).start()`. Con otro `for` de 1000 vueltas, haz lo mismo con los hilos que salen.

### Paso a paso
1. Crea el proyecto `ProblemaJardines` y el paquete `jardines`.
2. Crea la clase `RecursoJardin` con un atributo privado `int` llamado `cuenta`, que empiece en 100 en el constructor.
3. Escribe `incrementaCuenta`. Muestra `hilo ` + el nombre del hilo + ` ----- Entra en Jardín`.
4. Suma 1 con `cuenta++`.
5. Muestra `cuenta` + ` en jardín`.
6. Escribe `decrementaCuenta` igual, pero con `Sale de Jardín` y `cuenta--`.
7. Crea la clase `EntraJardin`, que implementa `Runnable`, guarda el jardín en un atributo recibido por el constructor y llama a `incrementaCuenta()` en `run()`.
8. Crea la clase `SaleJardin` igual, pero llamando a `decrementaCuenta()`.
9. En `Principal`, crea un solo `RecursoJardin`.
10. Con un `for` de 1 a 1000, crea un hilo con `EntraJardin` ("Entra1"...) y arráncalo con `start()` en la misma línea.
11. Con otro `for` de 1 a 1000, haz lo mismo con `SaleJardin` ("Sale1"...).
12. Ejecútalo varias veces y mira el último mensaje.

## Ejercicio 2: los jardines sincronizados (proyecto `JardinesSincronizado`)

Es el mismo programa del ejercicio 1: 100 personas, 10 entran y 10 salen a la vez. Pero ahora el resultado tiene que ser siempre el correcto.

El último mensaje es `100 en jardín`, en todas las ejecuciones.

### Pistas
No hay que cambiar los hilos ni `Principal`. El problema está dentro del jardín: dos hilos están a la vez en el mismo método. Java tiene una palabra clave que deja entrar a un solo hilo cada vez en un método; los demás esperan fuera. Piensa en qué métodos tienes que ponérsela.

### Más ayuda
Copia el proyecto del ejercicio 1 y cambia solo `RecursoJardin`. Añade la palabra `synchronized` a la declaración de `incrementaCuenta` y también a la de `decrementaCuenta`. Con una sola no basta: un hilo que entra y otro que sale también se pisarían entre ellos, porque tocan la misma variable. Con los dos métodos `synchronized`, el jardín actúa como una puerta de una sola persona: mientras un hilo está dentro de cualquiera de los dos, los demás esperan.

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
