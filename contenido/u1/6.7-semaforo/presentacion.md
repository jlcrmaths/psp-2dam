<!-- html -->
  <h2>El semáforo de lectores y escritores</h2>
  <p>PSP · 2º DAM · Apartado 6.7</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Entender la clase <code>Semaforo</code>, que decide quién puede <b>leer</b> y quién puede <b>escribir</b></li>
    <li>Guardar el <b>estado</b> de los datos: libre, con lectores o con escritor</li>
    <li>Dejar leer a <b>varios lectores a la vez</b>, pero escribir a <b>uno solo y sin nadie más</b></li>
    <li>Leer la <b>salida</b> del programa y saber qué ha pasado</li>
    <li>Ver qué mejoraríamos</li>
    <li>Practicar con un ejercicio: la <b>discoteca</b>, con un fichero de verdad</li>
  </ul>

--

<!-- html -->
  <h3>De 6.6 al semáforo</h3>
  <p>En 6.6, el fichero lo usaba <b>un solo hilo cada vez</b>, aunque fuera lector.</p>
  <p class="fragment">Hoy afinamos: <b>leer no estropea nada</b>, así que varios lectores pueden leer <b>a la vez</b>. Escribir sí cambia los datos, y entonces el escritor tiene que estar <b>solo</b>.</p>

--

<!-- html -->
  <h3>Una idea para recordarlo</h3>
  <p>Una <b>sala de lectura</b> con un cartel en la puerta.</p>
  <ul>
    <li class="fragment"><b>LIBRE</b>: la sala está vacía. Puede entrar un lector o un escritor</li>
    <li class="fragment"><b>CON_LECTORES</b>: hay gente leyendo. Pueden entrar más lectores, pero ningún escritor</li>
    <li class="fragment"><b>CON_ESCRITOR</b>: alguien está escribiendo. No entra nadie</li>
  </ul>
  <p class="fragment caja">El <code>Semaforo</code> es el <b>cartel</b> de la puerta.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>else if</code>: «si no se cumple lo anterior, prueba esta otra condición».</p></div>
    <div class="nuevo-item"><span class="etiqueta">Idea</span><p>Un <b>estado</b> guardado en un <code>int</code>, más un <b>contador</b> de lectores. Con los dos, el semáforo sabe quién puede entrar.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Idea</span><p>Un método <code>private</code> que <b>devuelve un texto</b> (<code>info()</code>): una ayuda interna para no repetir el principio de cada mensaje.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>random()</code> de la clase <code>Math</code>: da un número al azar entre 0 y 1. Con él, cada hilo duerme un tiempo distinto.</p></div>
    </div>
    <p class="aviso">Repaso: <code>synchronized</code>, <code>wait()</code>, <code>notify()</code>, <code>while</code>, <code>sleep()</code>, <code>Runnable</code> y <code>static final</code> funcionan igual que en 6.4, 6.5 y 6.6.</p>

---

<!-- html -->
  <h3>Las reglas: quién puede entrar</h3>
  <table class="peque">
    <tr><th>Estado del semáforo</th><th>¿Entra un lector?</th><th>¿Entra un escritor?</th></tr>
    <tr><td><code>LIBRE</code></td><td>Sí</td><td>Sí</td></tr>
    <tr><td><code>CON_LECTORES</code></td><td>Sí</td><td><b>No</b>: espera</td></tr>
    <tr><td><code>CON_ESCRITOR</code></td><td><b>No</b>: espera</td><td><b>No</b>: espera</td></tr>
  </table>
  <p class="fragment caja">El estado cambia cuando alguien <b>entra</b> o <b>termina</b>.</p>

---

<!-- html -->
  <h3>Los datos del semáforo</h3>
  {{codigo: LectoresEscritoresSemaforo/Semaforo.java :: 1-8 @@ 3|4|5|7|8}}
  <ul class="peque">
    <li><code>LIBRE = 0</code>, <code>CON_LECTORES = 1</code>, <code>CON_ESCRITOR = 2</code>: los tres estados posibles, con nombre para no escribir números sueltos</li>
    <li><code>private int estado = LIBRE;</code> en qué estado está ahora. Empieza <b>libre</b></li>
    <li><code>private int tLectores = 0;</code> cuántos lectores están leyendo ahora mismo</li>
  </ul>

--

<!-- html -->
  <h3>¿Por qué constantes y no números?</h3>
  <ul>
    <li><code>if (estado == 2)</code>: ¿qué es 2?</li>
    <li class="fragment"><code>if (estado == CON_ESCRITOR)</code>: se lee solo</li>
    <li class="fragment"><code>static</code>: pertenece a la clase, no a cada objeto. <code>final</code>: no se puede cambiar. Juntos: una <b>constante</b></li>
  </ul>

--

<!-- html -->
  <h3>Un método auxiliar para los mensajes</h3>
  {{codigo: LectoresEscritoresSemaforo/Semaforo.java :: 10-12 @@ 2}}
  <ul class="peque">
    <li><code>private String info()</code>: un método <b>solo para uso interno</b> de la clase. Devuelve un texto, no cambia nada</li>
    <li>Da el principio de cada mensaje: <code>BD:1 3L</code> (estado 1 y 3 lectores)</li>
    <li>Así no hay que repetir ese trozo en cada <code>println</code></li>
  </ul>

---

<!-- html -->
  <h3>accesoLeer(): la puerta del lector</h3>
  {{codigo: LectoresEscritoresSemaforo/Semaforo.java :: 14-34 @@ 3-5|6-15|16-18|19-20}}

--

<!-- html -->
  <h3>Línea por línea: accesoLeer() (1)</h3>
  <ul class="peque">
    <li><code>public synchronized void accesoLeer()</code><br>Solo un hilo a la vez toca el estado. Es el método que llama un lector <b>antes de leer</b>.</li>
    <li><code>String nombre = Thread.currentThread().getName();</code><br>Guarda el nombre del hilo para los mensajes.</li>
    <li><code>if (estado == LIBRE)</code><br>Si no hay nadie, el lector entra y cambia el estado a <code>CON_LECTORES</code>.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea: accesoLeer() (2)</h3>
  <ul class="peque">
    <li><code>else if (estado == CON_ESCRITOR)</code><br>Si hay un escritor, el lector <b>no puede entrar</b>.</li>
    <li><code>while (estado == CON_ESCRITOR) { … wait(); }</code><br>Mientras siga el escritor, el lector avisa («ESPERA») y se duerme. Al despertar <b>vuelve a mirar</b> el estado.</li>
    <li>Al salir del <code>while</code>, el escritor ya terminó: el lector entra y pone <code>CON_LECTORES</code>.</li>
    <li><code>else { … }</code><br>El estado es <code>CON_LECTORES</code>: ya hay lectores. Entra <b>sin esperar</b> y sin cambiar el estado.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea: accesoLeer() (3)</h3>
  <ul class="peque">
    <li><code>tLectores++;</code><br>Un lector más leyendo. Se ejecuta <b>siempre</b>, entre por el camino que entre.</li>
    <li>El último <code>println</code> dice <code>Leyendo.....</code> y enseña el contador</li>
  </ul>
  <p class="caja">Tres caminos, <b>un único final</b>: sumar 1 a <code>tLectores</code>.</p>

--

<!-- html -->
  <h3>accesoEscribir(): la puerta del escritor</h3>
  {{codigo: LectoresEscritoresSemaforo/Semaforo.java :: 36-48 @@ 3-9|10-12}}
  <ul class="peque">
    <li><code>while (estado != LIBRE)</code>: el escritor espera si hay <b>lectores o escritor</b>: cualquier cosa que no sea <b>libre</b></li>
    <li>Al salir, la sala está libre: pone <code>CON_ESCRITOR</code> y escribe <b>solo</b></li>
    <li>Comparado con el lector, <b>la condición es más fuerte</b>: el lector solo espera ante un escritor</li>
  </ul>

--

<!-- html -->
  <h3>Terminar: avisar a los que esperan</h3>
  {{codigo: LectoresEscritoresSemaforo/Semaforo.java :: 50-63 @@ 2-4|8|9|10-13}}
  <ul class="peque">
    <li><code>escrituraFinalizada()</code>: el escritor se va, el estado vuelve a <code>LIBRE</code> y <code>notify()</code> despierta a uno que espera</li>
    <li><code>lecturaFinalizada()</code>: un lector menos con <code>tLectores--;</code></li>
    <li><code>if (tLectores == 0)</code>: solo el <b>último</b> lector deja el semáforo libre y avisa. Si quedan lectores, no hace falta avisar a nadie</li>
  </ul>

--

<!-- html -->
  <h3>Los hilos: Lector y Escritor</h3>
  {{codigo: LectoresEscritoresSemaforo/Lector.java :: 9-18 @@ 3|4|5-8|9}}
  <ul class="peque">
    <li>Dice «Intentando leer», pide permiso con <code>accesoLeer()</code> y <b>espera aquí si hace falta</b></li>
    <li><code>sleep(...)</code>: el tiempo de lectura, <b>fuera</b> de los métodos <code>synchronized</code></li>
    <li><code>lecturaFinalizada()</code>: avisa de que ha terminado</li>
    <li><code>Escritor</code> es igual, con <code>accesoEscribir()</code> y <code>escrituraFinalizada()</code></li>
  </ul>

---

<!-- html -->
  <h3>Probamos: 5 lectores y 2 escritores</h3>
  <p class="peque">Se crean un solo <code>Semaforo</code>, 5 hilos <code>Lector</code> y 2 hilos <code>Escritor</code>.</p>
  <div class="salida">Lector2: Intentando leer<br>BD:0 0L Lector2 entra a leer.<br>BD:1 1L Lector2 Leyendo.....<br>BD:1 1L Lector1 entra a leer.<br>BD:1 2L Lector1 Leyendo.....<br>…<br>BD:1 5L Escritor1 trata de escribir. ESPERA<br>Lector1: Ya ha leido<br>…<br>BD:0 0L Escritor1 entra a escribir.<br>BD:2 0L Escritor1 Escribiendo..</div>

--

<!-- html -->
  <h3>Cómo leer cada línea</h3>
  <ul>
    <li><code>BD:1</code> el <b>estado</b> en ese momento: 0 libre, 1 con lectores, 2 con escritor</li>
    <li><code>2L</code> cuántos <b>lectores</b> hay dentro</li>
    <li>Después, el hilo y lo que hace: <code>entra a leer</code>, <code>Leyendo</code>, <code>trata de escribir. ESPERA</code>…</li>
    <li>Fíjate: varios <code>Leyendo</code> <b>seguidos</b>, con el contador subiendo. Es lo que no pasaba en 6.6</li>
  </ul>

--

<!-- html -->
  <h3>La película, paso a paso</h3>
  <ol>
    <li class="fragment">Todos intentan entrar. El primer lector ve <b>LIBRE</b>: entra y el estado pasa a <b>CON_LECTORES</b></li>
    <li class="fragment">Los demás lectores ven <b>CON_LECTORES</b>: entran sin esperar. <code>tLectores</code> sube</li>
    <li class="fragment">Un escritor llega: el estado no es libre. Dice <b>ESPERA</b> y se duerme con <code>wait()</code></li>
    <li class="fragment">Los lectores van terminando. El <b>último</b> pone <b>LIBRE</b> y avisa con <code>notify()</code></li>
    <li class="fragment">El escritor despierta, ve <b>LIBRE</b>, entra y pone <b>CON_ESCRITOR</b>. Al terminar, vuelve a <b>LIBRE</b> y avisa al otro</li>
  </ol>

---

<!-- html -->
  <h3>Un fallo del ejemplo original: el paréntesis</h3>
  <pre><code class="language-java" data-trim>sleep((int) (Math.random()) * 50);    // siempre 0
sleep((int) (Math.random() * 500));   // de 0 a 499</code></pre>
  <ul class="peque">
    <li><code>Math.random()</code> da un número entre 0 y 1, por ejemplo <b>0,73</b></li>
    <li>En la primera línea, <code>(int)</code> se aplica a <code>0,73</code> y da <b>0</b>. Después se multiplica: <b>0 × 50 = 0</b>. Nadie duerme</li>
    <li>En la segunda, primero se multiplica (<b>0,73 × 500 = 365</b>) y después se pasa a <code>int</code>: <b>365</b></li>
  </ul>
  <p class="caja">Sin dormir, casi nadie llega a ver <code>ESPERA</code>. Por eso aquí el paréntesis está corregido.</p>

--

<!-- html -->
  <h3>¿<code>notify()</code> o <code>notifyAll()</code>?</h3>
  <ul>
    <li>Cuando un escritor termina, <code>notify()</code> despierta a <b>uno</b> solo de los que esperan</li>
    <li class="fragment">Si despierta a un lector, <b>entra él</b>. Los demás lectores siguen dormidos aunque <b>también podrían entrar</b></li>
    <li class="fragment">Con <code>notifyAll()</code> despertarían <b>todos los lectores a la vez</b> y leerían juntos</li>
    <li class="fragment">El programa <b>no se cuelga</b> con <code>notify()</code>: cada vez que el estado vuelve a <b>LIBRE</b> se avisa a otro. Pero es <b>menos eficiente</b></li>
  </ul>

--

<!-- html -->
  <h3>Un problema que no se ve: la inanición</h3>
  <p>Un lector puede entrar <b>siempre</b> que haya lectores. Si llegan lectores sin parar, el semáforo nunca queda <code>LIBRE</code>.</p>
  <p class="fragment">El escritor se queda <b>esperando para siempre</b>. Se llama <b>inanición</b>.</p>
  <p class="fragment caja">Aquí cada hilo lee o escribe una sola vez, y no pasa. En un programa real habría que darle <b>prioridad</b> al escritor que espera.</p>

---

<!-- html -->
  <h3>Comparamos con 6.6</h3>
  <table class="peque">
    <tr><th></th><th>6.6 <code>Fichero</code></th><th>6.7 <code>Semaforo</code></th></tr>
    <tr><td>Lectores a la vez</td><td>No: uno cada vez</td><td><b>Sí</b></td></tr>
    <tr><td>Escritor</td><td>Solo</td><td>Solo</td></tr>
    <tr><td>Qué guarda</td><td>Dos contadores (<code>lectores</code> y <code>escritores</code>)</td><td>Un <b>estado</b> y un contador de lectores</td></tr>
    <tr><td>Condición del lector</td><td>Hay lectores <b>o</b> escritores</td><td>Hay un escritor</td></tr>
    <tr><td>Avisa con</td><td><code>notifyAll()</code></td><td><code>notify()</code></td></tr>
  </table>

---

<!-- html -->
  <h3>Probarlo en el simulador</h3>
  <p>Con los lectores y los escritores verás cómo cambia el estado de los datos: <code>LIBRE</code>, <code>CON_LECTORES</code> y <code>CON_ESCRITOR</code>.</p>
  <ul>
    <li>Arrastra o pulsa las piezas para escribir los cuatro métodos del <code>Semaforo</code> y los dos hilos</li>
    <li>Fíjate en que <b>varios lectores</b> están dentro a la vez, pero el escritor siempre entra <b>solo</b></li>
    <li>Quita el <code>if (tLectores == 0)</code>, el <code>notify()</code> o la marca <code>CON_LECTORES</code> y mira <b>qué falla</b></li>
    <li>El panel <b>Experimentos</b> te propone situaciones para ejecutar y, poco a poco, te hace escribir cada método y cada hilo</li>
  </ul>
  <p class="aviso"><a href="../../simulador/index.html#semaforo&experimentos" target="_blank" rel="noopener">Semáforo de lectores y escritores</a> (se abre en otra pestaña).</p>

---

<!-- html -->
  <h3>Ahora, un ejercicio: la discoteca</h3>
  <ul>
    <li><b>5 hilos lectores</b> y <b>2 hilos escritores</b> comparten el fichero <code>Discoteca.txt</code></li>
    <li>Los escritores escriben su nombre en una <b>línea nueva</b></li>
    <li>Los lectores cuentan cuántas <b>líneas</b> tiene el fichero en ese momento</li>
    <li>Varios lectores a la vez, sí. Un escritor, <b>solo</b></li>
  </ul>
  <p class="peque">Proyecto <b>Discoteca</b>. Es el mismo problema del semáforo, ahora con un <b>fichero de verdad</b>.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo del ejercicio</h3>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>File</code>: representa un fichero del disco por su nombre. No lo abre: solo dice cuál es.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>BufferedReader</code> y <code>FileReader</code>: abren un fichero para <b>leer</b>. El método <code>readLine()</code> lee una línea y devuelve <code>null</code> al llegar al final.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>BufferedWriter</code> y <code>FileWriter</code>: abren un fichero para <b>escribir</b>. <code>write()</code> escribe un texto y <code>newLine()</code> añade el salto de línea.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>flush()</code> de <code>BufferedWriter</code>: manda al fichero lo que está en el buffer. Sin él, el texto se queda en memoria y <b>no llega al disco</b>. <code>close()</code> cierra el fichero (y también vacía el buffer).</p></div>
    </div>

--

<!-- html -->
  <h3>Cómo pensarlo</h3>
  <ul>
    <li>¿Qué es lo que comparten los siete hilos? <span class="fragment">La discoteca, o sea, el fichero. Será una clase: <code>Discoteca</code>.</span></li>
    <li>¿Qué debe recordar? <span class="fragment">Cuántos lectores hay (<code>lectores</code>) y cuántos escritores (<code>escritores</code>). Sin estado: con los dos contadores basta.</span></li>
    <li>¿Cuándo espera un <b>lector</b>? <span class="fragment">Solo si hay algún <b>escritor</b>.</span></li>
    <li>¿Cuándo espera un <b>escritor</b>? <span class="fragment">Si hay algún <b>lector o</b> algún <b>escritor</b>.</span></li>
  </ul>

--

<!-- html -->
  <h3>Solución: los datos y el constructor</h3>
  {{codigo: Discoteca/Discoteca.java :: 9-18 @@ 3|4-5|7-10}}
  <ul class="peque">
    <li><code>private final File fichero;</code> el fichero (<code>final</code>, como en 6.5: se fija en el constructor y no cambia)</li>
    <li><code>lectores</code> y <code>escritores</code>: dos contadores, como en el semáforo pero sin estado</li>
    <li>El constructor recibe el <b>nombre</b>, crea el <code>File</code> y deja el fichero <b>vacío</b>: <code>new FileWriter(fichero).close();</code></li>
  </ul>

--

<!-- html -->
  <h3>leer(): la puerta del lector</h3>
  {{codigo: Discoteca/Discoteca.java :: 20-28 @@ 2-5|6-8}}
  <ul class="peque">
    <li><code>while (escritores &gt; 0)</code>: el lector espera <b>solo</b> si hay un escritor. Con otros lectores, entra</li>
    <li>Entra: <code>lectores++</code> y mensaje con los lectores activos</li>
    <li><b>Devuelve el fichero abierto</b> (<code>BufferedReader</code>). Así el lector lo recorre <b>fuera</b> del método <code>synchronized</code>, sin bloquear a los demás</li>
  </ul>

--

<!-- html -->
  <h3>terminaLeer()</h3>
  {{codigo: Discoteca/Discoteca.java :: 30-36 @@ 2-3|4-6}}
  <ul class="peque">
    <li>Un lector menos, y lo dice</li>
    <li><code>if (lectores == 0)</code>: solo el <b>último</b> lector avisa. Si quedan lectores, los que esperan (escritores) no pueden entrar todavía</li>
  </ul>

--

<!-- html -->
  <h3>escribir() y terminaEscribir()</h3>
  {{codigo: Discoteca/Discoteca.java :: 38-52 @@ 2-5|6-8|11-14}}
  <ul class="peque">
    <li><code>while (lectores &gt; 0 || escritores &gt; 0)</code>: el escritor espera si hay <b>cualquiera</b> dentro</li>
    <li>Entra: <code>escritores++</code> y devuelve un <code>BufferedWriter</code>. <code>true</code> en <code>new FileWriter(fichero, true)</code> significa <b>añadir al final</b> en vez de borrar</li>
    <li>Al terminar: <code>escritores--</code> y <code>notifyAll()</code>. Avisa a <b>todos</b>, porque ahora pueden entrar lectores <b>y</b> escritores</li>
  </ul>

--

<!-- html -->
  <h3>Solución: el lector</h3>
  {{codigo: Discoteca/Lector.java :: 13-27 @@ 3|4|5-7|8|9|10}}
  <ul class="peque">
    <li><code>leer()</code> puede hacer esperar al lector. Cuando entra, recibe el fichero abierto</li>
    <li>El <code>while</code> con <code>readLine()</code> cuenta las líneas hasta que devuelve <code>null</code></li>
    <li><code>close()</code> cierra el fichero. Después, muestra el resultado y avisa con <code>terminaLeer()</code></li>
    <li>Los <code>catch</code> recogen las excepciones de <code>wait()</code> y del fichero</li>
  </ul>

--

<!-- html -->
  <h3>Solución: el escritor</h3>
  {{codigo: Discoteca/Escritor.java :: 13-25 @@ 3|4-5|6|7|8}}
  <ul class="peque">
    <li><code>escribir()</code> hace esperar al escritor hasta que esté solo</li>
    <li><code>write()</code> escribe el nombre del hilo y <code>newLine()</code> pasa a la línea siguiente</li>
    <li><code>flush()</code> <b>manda al fichero</b> lo escrito: sin él se quedaría en el buffer. Después avisa con <code>terminaEscribir()</code></li>
  </ul>

--

<!-- html -->
  <h3>Dos cuidados con el fichero</h3>
  <ul>
    <li><b>Vaciar el buffer.</b> El <code>BufferedWriter</code> guarda el texto en memoria y lo manda al fichero cuando se llena, o cuando se llama a <code>flush()</code> o <code>close()</code>. Sin <code>flush()</code> el fichero queda <b>vacío</b> y los lectores cuentan 0 líneas</li>
    <li><b>Que el fichero exista.</b> Si un lector lo abre antes de que se haya creado, <code>FileReader</code> lanza <code>FileNotFoundException</code>. Como el lector ya había sumado <code>lectores++</code> y nunca llega a <code>terminaLeer()</code>, el contador se queda en 1 y los <b>escritores esperan para siempre</b></li>
  </ul>
  <p class="caja">Por eso el constructor crea el fichero vacío, y por eso el escritor hace <code>flush()</code>.</p>

--

<!-- html -->
  <h3>Probamos la discoteca</h3>
  <div class="salida">Lector0 entro a leer. Lectores activos: 1<br>Lector1 entro a leer. Lectores activos: 2<br>Lector0 he leído 0 líneas en el fichero<br>…<br>Lector4 termino de leer. Lectores activos: 0<br>Escritor0 entro a escribir.<br>Escritor1 no puedo escribir. Esperando<br>Escritor0 he escrito mi nombre en el fichero<br>Escritor0: He terminado de escribir<br>Escritor1 entro a escribir.<br>…</div>
  <ul class="peque">
    <li>Varios <code>Lectores activos</code> a la vez: el contador sube</li>
    <li>El escritor entra solo cuando el contador llega a <b>0</b></li>
    <li>Al final, <code>Discoteca.txt</code> tiene <b>2 líneas</b>: <code>Escritor0</code> y <code>Escritor1</code></li>
  </ul>

--

<!-- html -->
  <h3>Discoteca y semáforo: el mismo problema</h3>
  <table class="peque">
    <tr><th></th><th><code>Semaforo</code></th><th><code>Discoteca</code></th></tr>
    <tr><td>Qué guarda</td><td>Un <b>estado</b> y un contador de lectores</td><td>Dos contadores: <code>lectores</code> y <code>escritores</code></td></tr>
    <tr><td>Lector espera si…</td><td>El estado es <code>CON_ESCRITOR</code></td><td><code>escritores &gt; 0</code></td></tr>
    <tr><td>Escritor espera si…</td><td>El estado no es <code>LIBRE</code></td><td><code>lectores &gt; 0 || escritores &gt; 0</code></td></tr>
    <tr><td>Avisa con</td><td><code>notify()</code></td><td><code>notifyAll()</code></td></tr>
    <tr><td>Datos</td><td>Ninguno</td><td>Un <b>fichero</b> real</td></tr>
  </table>

---

<!-- html -->
  <h3>Errores típicos</h3>
  <ul>
    <li>Olvidar el <code>tLectores++</code> en alguno de los tres caminos del lector: el contador no cuadra y el escritor nunca entra</li>
    <li>Poner <code>estado = LIBRE</code> cada vez que sale un lector, y no solo el <b>último</b>: un escritor entra con lectores leyendo</li>
    <li>Olvidar el <code>notify()</code> al quedar libre: los que esperan no despiertan y el programa <b>no termina</b></li>
    <li>Usar <code>if</code> en vez de <code>while</code> en la espera: al despertar no se vuelve a mirar el estado</li>
    <li>Un <code>Semaforo</code> (o una <code>Discoteca</code>) por hilo: nadie se espera</li>
    <li>Olvidar el <code>flush()</code> del escritor: lo escrito no llega al disco y los lectores ven 0 líneas</li>
    <li>Abrir el fichero antes de que exista: <code>FileNotFoundException</code> y, si el contador no se corrige, los escritores esperan para siempre</li>
  </ul>

--

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>¿Qué pasa si los lectores no llaman a <code>lecturaFinalizada()</code>?</li>
    <li>Cambia <code>notify()</code> por <code>notifyAll()</code>. ¿Qué cambia en la salida?</li>
    <li>¿Por qué <code>lecturaFinalizada()</code> solo avisa cuando <code>tLectores == 0</code>?</li>
    <li>¿Cómo evitarías que un escritor se quede esperando para siempre?</li>
    <li>¿Podría un lector entrar con el estado <code>CON_ESCRITOR</code>? ¿Y un escritor con <code>CON_LECTORES</code>?</li>
    <li>En la discoteca, ¿por qué <code>terminaLeer()</code> solo avisa cuando <code>lectores == 0</code> y <code>terminaEscribir()</code> avisa siempre?</li>
    <li>¿Qué pasaría si el lector no llamara a <code>terminaLeer()</code> cuando falla el fichero?</li>
  </ol>
