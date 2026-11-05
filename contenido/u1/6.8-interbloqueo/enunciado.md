# Apartado 6.8 – Interbloqueo

Parte del proyecto `Interbloqueo`: **[descarga Interbloqueo.zip](Interbloqueo.zip)**. Descomprímelo y ábrelo en NetBeans (Archivo > Abrir proyecto).

En el proyecto, dos hilos necesitan los dos mismos ficheros, A y B, y cada fichero solo admite un hilo a la vez. Todas las clases van en el paquete `interbloqueo`.

Haz los ejercicios en orden. A partir del Ejercicio 2, **no modifiques el proyecto original**: haz una copia con el nombre que se indica (clic derecho sobre el proyecto, `Copiar…`) y trabaja en la copia. Así cada ejercicio parte del programa que se bloquea.

En todos los ejercicios, el arreglo está bien hecho cuando **el programa termina solo** y, a los 5 segundos, `main` muestra los dos hilos en estado `TERMINATED`.

## Ejercicio 1: ejecuta y averigua qué pasa (proyecto `Interbloqueo`)

Ejecuta el proyecto y espera unos 10 segundos. Después responde por escrito:

- ¿El programa termina? ¿Sale algún error?
- ¿En qué estado está cada hilo al final?
- ¿Qué fichero tiene cada hilo y qué fichero está esperando?
- ¿Cuál de las cuatro condiciones del interbloqueo (exclusión mutua, retener y esperar, sin quitárselo, espera en círculo) crees que sería más fácil de evitar?

Detén el programa a mano cuando termines.

### Pistas
Lee los mensajes que salen por pantalla, en orden. Cada hilo dice qué fichero tiene y cuál pide. Fíjate en el último mensaje que escribe cada hilo: lo que ya no escribe te dice dónde se ha quedado. Para el estado, mira las dos últimas líneas.

### Más ayuda
Mira con calma el orden en que cada hilo recibe los ficheros en `Principal`, y qué hace `Trabajo` con ellos: coge el primero, duerme un segundo y pide el segundo. Piensa qué ha hecho el otro hilo durante ese segundo. El estado `BLOCKED` significa que el hilo espera el cerrojo de un objeto `synchronized`. Para la última pregunta, piensa qué condición puedes cambiar tocando muy pocas líneas.

### Paso a paso
1. Ejecuta el proyecto y espera 10 segundos sin tocar nada.
2. Comprueba que no se ha abierto ningún error en la consola y que el botón de ejecución de NetBeans sigue activo: el programa no ha terminado.
3. Apunta cuál es el último mensaje que ha escrito cada hilo.
4. Apunta el estado que `main` muestra para cada hilo.
5. Escribe en una frase quién tiene A, quién tiene B y a quién espera cada uno.
6. Dibuja dos cuadrados (los ficheros) y dos flechas: una de «lo tiene» y otra de «lo espera» por cada hilo. ¿Se forma un círculo?
7. Para la última pregunta, elige una de las cuatro condiciones y escribe cómo la evitarías. Lo comprobamos en los ejercicios siguientes.

## Ejercicio 2: el mismo orden (proyecto `InterbloqueoOrden`)

Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoOrden` y arregla el interbloqueo cambiando lo mínimo posible. Los dos hilos tienen que usar los dos ficheros a la vez, y deben acabar y mostrar `Hilo 1 termina` y `Hilo 2 termina`.

### Pistas
El interbloqueo necesita una espera en círculo: uno espera al otro y el otro espera al uno. Piensa qué ocurre si los dos hilos quieren los ficheros en el mismo orden. Mira dónde se decide el orden en que cada hilo recibe los ficheros.

### Más ayuda
Los dos hilos usan la misma clase `Trabajo`, que siempre coge primero el fichero que recibe como primero. El orden lo decide `Principal` al crear cada trabajo. Si los dos reciben el mismo orden, el que llega segundo se queda esperando el primer fichero y no tiene nada cogido, así que no bloquea al otro.

### Paso a paso
1. Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoOrden` y ábrelo.
2. Abre `Principal` y localiza las dos líneas donde se crean los hilos con `new Trabajo(...)`.
3. Fíjate en que a un hilo se le pasa `(a, b)` y al otro `(b, a)`.
4. Cambia la línea del segundo hilo para que reciba `(a, b)`, como el primero.
5. No hace falta tocar `Trabajo` ni `Fichero`.
6. Ejecuta. Comprueba que el hilo 2 espera unos segundos y que después los dos terminan.
7. Comprueba que `main` muestra `TERMINATED` en los dos hilos.

## Ejercicio 3: un solo cerrojo (proyecto `InterbloqueoUnCerrojo`)

Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoUnCerrojo`. Esta vez los dos hilos **siguen recibiendo los ficheros en orden distinto**, `(a, b)` y `(b, a)`, y aun así no se bloquean. Los dos hilos siguen usando los dos ficheros a la vez, y acaban uno detrás del otro.

### Pistas
Antes había dos cerrojos, uno por fichero, y por eso se podía esperar en círculo. Piensa qué pasa si solo hay un cerrojo para los dos ficheros: ¿pueden los dos hilos tener algo cogido a la vez? Ese cerrojo tiene que ser el mismo objeto para los dos hilos, así que alguien lo tiene que crear y repartir.

### Más ayuda
Hace falta un objeto nuevo que no sea ninguno de los ficheros, solo para hacer de cerrojo. Se crea una sola vez en `Principal` y se entrega a los dos trabajos por el constructor, como se entregan los ficheros. En `Trabajo`, el hilo coge el cerrojo de ese objeto una sola vez, con un único `synchronized`, y trabaja con los dos ficheros dentro. Ya no hace falta un `synchronized` por fichero.

### Paso a paso
1. Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoUnCerrojo` y ábrelo.
2. En `Trabajo`, añade un atributo de tipo `Object` llamado `candado`.
3. Cambia el constructor de `Trabajo` para que reciba también el `candado` y lo guarde.
4. En `run()`, cambia los dos `synchronized` anidados por un solo `synchronized (candado)` que envuelva todo el trabajo.
5. Quita los `synchronized` de `primero` y `segundo`: ya no se necesitan.
6. En `Principal`, crea un solo objeto `Object` y entrégalo a los dos `new Trabajo(...)`.
7. No cambies el orden en que se pasan `a` y `b`.
8. Ejecuta. Comprueba que un hilo entra y el otro espera hasta que termine, y que los dos acaban.

## Ejercicio 4: no retener lo que se tiene (proyecto `InterbloqueoSoltar`)

Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoSoltar`. Los hilos siguen recibiendo `(a, b)` y `(b, a)`. Cada hilo usa los ficheros **de uno en uno**: nunca tiene un fichero cogido mientras pide el otro. Cada hilo debe mostrar `tiene A: trabaja` cuando usa el primer fichero, y `tiene B: trabaja` cuando usa el segundo (con el nombre del fichero que corresponda).

### Pistas
Una de las cuatro condiciones es «retener y esperar»: se queda con un fichero mientras pide otro. Si el hilo suelta el primero antes de pedir el segundo, nunca retiene nada mientras espera. Piensa dónde acaba el trabajo con el primer fichero y cómo se hace que el hilo lo suelte en ese momento.

### Más ayuda
Ahora hay dos bloques `synchronized` **seguidos**, no uno dentro de otro. El primer bloque coge el primer fichero, trabaja con él y lo suelta al cerrar las llaves. Después, el segundo bloque coge el segundo fichero. El `sleep()` del trabajo con el primer fichero va dentro del primer bloque. El mensaje de «pide» va entre los dos bloques.

### Paso a paso
1. Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoSoltar` y ábrelo.
2. En `Trabajo`, abre `run()` y localiza los dos `synchronized` anidados.
3. Deja el primer bloque con el mensaje de que tiene el primer fichero y el `sleep()` dentro. Cierra sus llaves ahí.
4. Después de cerrarlas, muestra que pide el segundo fichero.
5. Escribe el segundo `synchronized (segundo)` **fuera** del primero, a continuación.
6. Dentro del segundo bloque, muestra que tiene el segundo fichero y que trabaja.
7. Deja el mensaje `termina` al final, como estaba.
8. Ejecuta. Comprueba que el programa termina. Comprueba también que ya no sale nunca un mensaje con los dos ficheros a la vez.
9. Piensa qué pierdes con esta solución: ¿y si el trabajo necesitara los dos ficheros a la vez para poder hacerse?

## Ejercicio 5: el orden lo pone el programa (proyecto `InterbloqueoNumeros`)

Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoNumeros`. Los hilos siguen recibiendo `(a, b)` y `(b, a)`, y los dos ficheros se siguen usando a la vez. Cada fichero tiene un **número** (A el 1 y B el 2) y `Trabajo` pide siempre primero el fichero de número más bajo, **sin que importe en qué orden le lleguen**. Se usa un solo cerrojo por fichero, como al principio.

### Pistas
Es la solución del mismo orden, pero hecha de forma que no dependa de quien crea los hilos: si alguien se equivoca en `Principal`, el programa sigue funcionando. Para ordenar necesitas algo que distinga un fichero de otro: un número guardado en el propio fichero. Y alguien tiene que comparar los dos números y decidir cuál va primero.

### Más ayuda
Añade a `Fichero` un atributo `int` con el número, que se pasa por el constructor, y un método para leerlo. En `Principal`, los ficheros se crean con su número. En `Trabajo`, el constructor recibe los dos ficheros en cualquier orden y compara sus números con un `if`: guarda en `primero` el de número más bajo y en `segundo` el otro. El resto de `run()` queda igual que en el proyecto original.

### Paso a paso
1. Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoNumeros` y ábrelo.
2. En `Fichero`, añade un atributo `numero` de tipo `int`.
3. Cambia el constructor de `Fichero` para que reciba también el número y lo guarde.
4. Añade a `Fichero` el método `getNumero()`, que devuelve el número.
5. En `Principal`, crea el fichero A con el número 1 y el fichero B con el número 2.
6. En `Trabajo`, cambia el constructor para que sus dos parámetros se llamen, por ejemplo, `uno` y `otro`.
7. Dentro del constructor, escribe un `if` que compare `uno.getNumero()` con `otro.getNumero()`.
8. Si el de `uno` es más bajo, guarda `uno` en `primero` y `otro` en `segundo`. Si no, al revés.
9. No toques `run()`.
10. Ejecuta. Comprueba que los dos hilos piden el fichero A antes que el B aunque `Principal` se lo dé al revés al hilo 2.

## Ejercicio 6 (reto): esperar con tiempo máximo (proyecto `InterbloqueoTiempo`)

Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoTiempo`. Los hilos siguen recibiendo `(a, b)` y `(b, a)`, y los dos ficheros se siguen usando a la vez. Si un hilo no consigue el segundo fichero en **1 segundo**, muestra `no consigue B: suelta A y reintenta`, suelta el primero, espera un rato al azar y lo vuelve a intentar desde el principio. Los dos hilos acaban mostrando `termina`. Aquí puede que veas algún reintento antes de que acaben. Esto es normal. Cambia a 8 segundos el tiempo que espera `main` antes de mostrar los estados.

### Pistas
Hasta ahora, un hilo que pide un cerrojo ocupado espera para siempre. Hace falta un cerrojo que se pueda pedir diciendo «espero como mucho este tiempo». Java tiene una clase para eso, en el paquete `java.util.concurrent.locks`. Y si un hilo se rinde, tiene que soltar lo que tiene cogido; si no, el otro no puede avanzar. Si los dos reintentan justo a la vez, pueden bloquearse otra vez: piensa cómo evitarlo.

### Más ayuda
La clase es `ReentrantLock`. Cada `Fichero` guarda su propio `ReentrantLock` y lo entrega con un método. El hilo lo coge con `lock()`, espera un tiempo con `tryLock()` (que devuelve `true` si lo consigue y `false` si no) y lo suelta con `unlock()`. `tryLock()` recibe la cantidad de tiempo y la unidad, con `TimeUnit.SECONDS`. `Trabajo` se repite en un `while` hasta que consigue los dos ficheros. Para que los dos hilos no reintenten a la vez, espera un tiempo al azar con `Random` y `Thread.sleep()`.

### Paso a paso
1. Copia el proyecto `Interbloqueo` con el nombre `InterbloqueoTiempo` y ábrelo.
2. En `Fichero`, añade un atributo `ReentrantLock` creado con `new ReentrantLock()` y un método que lo devuelve.
3. En `Trabajo`, añade una variable `boolean` llamada `hecho`, a `false`, y un `Random`.
4. Escribe en `run()` un `while` que se repita mientras `hecho` sea `false`, y mete todo dentro de un `try` con `catch (InterruptedException e)`.
5. Dentro del `while`, coge el cerrojo del primer fichero con `lock()`. Muestra que lo tiene y duerme un segundo.
6. Muestra que pide el segundo y llama a `tryLock()` sobre el cerrojo del segundo, con 1 y `TimeUnit.SECONDS`, dentro de un `if`.
7. Si devuelve `true`: muestra que trabaja con los dos, suelta los dos cerrojos con `unlock()` y pon `hecho` a `true`.
8. Si devuelve `false`: muestra el mensaje de reintento, suelta el primer cerrojo con `unlock()` y duerme un tiempo al azar de hasta un segundo.
9. Al salir del `while`, muestra que el hilo termina.
10. En `Principal`, cambia la espera de `main` a 8 segundos.
11. Ejecuta varias veces. Comprueba que los dos hilos acaban siempre y que, a veces, hay reintentos.
