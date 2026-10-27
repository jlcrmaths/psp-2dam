<!-- html -->
  <h2>Interbloqueo</h2>
  <p>PSP · 2º DAM · Apartado 6.8</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Entender qué es un <b>interbloqueo</b> (en inglés, <i>deadlock</i>)</li>
    <li>Ver cómo se produce en un ejemplo con <b>dos hilos y dos ficheros</b></li>
    <li>Reconocerlo: el programa <b>no da error y no termina</b></li>
    <li>Saber qué <b>estados</b> puede tener un hilo, y cuál es el de un hilo interbloqueado</li>
    <li>Evitarlo: pedir los recursos <b>siempre en el mismo orden</b></li>
  </ul>

--

<!-- html -->
  <h3>De «esperar un aviso» a «esperar al otro»</h3>
  <p>En 6.4 los hilos esperaban con <code>wait()</code> a que <b>alguien les avisara</b>. Si el aviso no llegaba, se quedaban colgados.</p>
  <p class="fragment">Hoy es distinto: cada hilo tiene <b>algo que el otro necesita</b>, y los dos esperan a que el otro lo suelte. Ninguno lo soltará.</p>

--

<!-- html -->
  <h3>Una idea para recordarlo</h3>
  <p>Dos personas en una <b>puerta estrecha</b>, una frente a la otra.</p>
  <ul>
    <li class="fragment">Cada una espera a que la otra se aparte para poder pasar</li>
    <li class="fragment">Ninguna se aparta primero, porque está esperando a la otra</li>
    <li class="fragment">Pueden quedarse así <b>para siempre</b></li>
  </ul>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p><b>Interbloqueo</b>: dos o más hilos esperan cada uno algo que tiene otro, y ninguno puede avanzar.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Idea</span><p>Un hilo puede tener el <b>cerrojo de un objeto</b> y pedir el de <b>otro</b>. Si dos hilos lo hacen en orden contrario, se bloquean.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>getState()</code> de la clase <code>Thread</code>: devuelve el <b>estado</b> del hilo. Un hilo que espera el cerrojo de un objeto está en <code>BLOCKED</code>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>synchronized (objeto) { … }</code>: coge el cerrojo de ese objeto <b>solo durante el bloque</b>, en vez de en todo el método.</p></div>
    </div>
    <p class="aviso">Repaso: <code>synchronized</code>, <code>sleep()</code>, <code>this</code>, <code>Runnable</code> y <code>throws</code> funcionan igual que en 6.4, 6.5 y 6.7.</p>

---

<!-- html -->
  <h3>Cuándo puede haber interbloqueo</h3>
  <p>Para que ocurra se tienen que cumplir <b>las cuatro</b> cosas a la vez:</p>
  <ol>
    <li class="fragment"><b>Exclusión mutua</b>: el recurso solo lo usa un hilo cada vez (<code>synchronized</code>)</li>
    <li class="fragment"><b>Retener y esperar</b>: un hilo se queda con un recurso mientras pide otro</li>
    <li class="fragment"><b>Sin quitárselo</b>: nadie puede arrebatarle el recurso al hilo que lo tiene</li>
    <li class="fragment"><b>Espera en círculo</b>: A espera a B y B espera a A</li>
  </ol>
  <p class="fragment caja">Si evitamos <b>una sola</b>, no hay interbloqueo.</p>

---

<!-- html -->
  <h3>El ejemplo: dos ficheros</h3>
  <ul>
    <li>Hay dos ficheros, <code>FicheroA</code> y <code>FicheroB</code>. Cada uno solo admite <b>un hilo a la vez</b></li>
    <li>El <b>hilo 1</b> entra en A y después necesita B</li>
    <li>El <b>hilo 2</b> entra en B y después necesita A</li>
  </ul>
  <p class="peque">Proyecto <b>Interbloqueo</b></p>

--

<!-- html -->
  <h3>FicheroA: entra en A y pide B</h3>
  {{codigo: Interbloqueo/FicheroA.java :: 1-15 @@ 3|5|7-10|12|13}}

--

<!-- html -->
  <h3>Línea por línea: FicheroA (1)</h3>
  <ul class="peque">
    <li><code>public synchronized void metodoA(FicheroB b)</code><br>Para entrar, el hilo coge el <b>cerrojo de este FicheroA</b>. Recibe el <code>FicheroB</code> que va a pedir después</li>
    <li><code>System.out.println(nombre + " entra en fichero_A");</code><br>El hilo dice que ya ha entrado en A</li>
    <li><code>Thread.sleep(1000);</code><br>Espera un segundo. <b>El <code>sleep()</code> no suelta el cerrojo</b>: sigue teniendo A. Este segundo da tiempo a que el otro hilo entre en B</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea: FicheroA (2)</h3>
  <ul class="peque">
    <li><code>System.out.println(nombre + " intentando acceder a fichero_B");</code><br>Va a pedir el otro fichero</li>
    <li><code>b.metodoB(this);</code><br>Llama al método de B, que también es <code>synchronized</code>: hace falta el <b>cerrojo de B</b>. <code>this</code> es este mismo <code>FicheroA</code>, que se le pasa a B</li>
    <li>Si B está ocupado, el hilo <b>espera</b>, pero <b>sigue teniendo el cerrojo de A</b></li>
  </ul>
  <p class="caja">Esto es «retener y esperar»: tiene A y pide B.</p>

--

<!-- html -->
  <h3>FicheroB: lo mismo al revés</h3>
  <ul class="peque">
    <li><code>metodoB(FicheroA a)</code> es <b>igual</b> que <code>metodoA</code>, pero entra en <b>B</b> y después pide <b>A</b> con <code>a.metodoA(this)</code></li>
    <li>También es <code>synchronized</code>: coge el cerrojo de B</li>
  </ul>
  <p class="caja">Uno entra por A y pide B. El otro entra por B y pide A.</p>

--

<!-- html -->
  <h3>Los hilos: cada uno por su lado</h3>
  {{codigo: Interbloqueo/Hilo1.java :: 11-14 @@ 3}}
  <ul class="peque">
    <li><code>Hilo1</code> llama a <code>a.metodoA(b)</code>: empieza por el <b>fichero A</b></li>
    <li><code>Hilo2</code> llama a <code>b.metodoB(a)</code>: empieza por el <b>fichero B</b></li>
    <li>Reciben los dos ficheros por el <b>constructor</b>: son los mismos dos objetos para los dos hilos</li>
  </ul>

--

<!-- html -->
  <h3>Principal: arranca los dos hilos</h3>
  {{codigo: Interbloqueo/Principal.java :: 3-15 @@ 5-6|7-8|10|11-12}}
  <ul class="peque">
    <li>Se crean <b>un solo</b> <code>FicheroA</code> y <b>un solo</b> <code>FicheroB</code> y se arrancan los dos hilos</li>
    <li>Después de 3 segundos, <code>main</code> pregunta el estado de cada hilo con <code>getState()</code></li>
  </ul>

---

<!-- html -->
  <h3>La película, paso a paso</h3>
  <ol>
    <li class="fragment"><b>Segundo 0</b>. El hilo 1 entra en A: coge el <b>cerrojo de A</b>. El hilo 2 entra en B: coge el <b>cerrojo de B</b></li>
    <li class="fragment">Los dos <b>duermen</b> un segundo, <b>sin soltar</b> su cerrojo</li>
    <li class="fragment"><b>Segundo 1</b>. El hilo 1 pide el cerrojo de B: lo tiene el hilo 2, <b>espera</b></li>
    <li class="fragment">El hilo 2 pide el cerrojo de A: lo tiene el hilo 1, <b>espera</b></li>
    <li class="fragment"><b>Para siempre</b>: el hilo 1 espera al 2 y el hilo 2 espera al 1</li>
  </ol>

--

<!-- html -->
  <h3>Qué sale en pantalla</h3>
  <div class="salida">Hilo 1 entra en fichero_A<br>Hilo 2 entra en fichero_B<br>Hilo 1 intentando acceder a fichero_B<br>Hilo 2 intentando entrar en fichero_A<br>Hilo 1: BLOCKED<br>Hilo 2: BLOCKED<br>▮ (el programa no termina)</div>
  <ul class="peque">
    <li><b>No hay ningún error</b>: el programa simplemente se queda parado</li>
    <li>El orden de las dos primeras líneas puede cambiar. Lo que no cambia es el final</li>
    <li>En NetBeans, el botón de ejecución sigue activo: hay que detenerlo a mano</li>
  </ul>

--

<!-- html -->
  <h3>Los estados de un hilo</h3>
  <table class="peque">
    <tr><th>Estado</th><th>Cuándo ocurre</th></tr>
    <tr><td><code>NEW</code></td><td>Se ha creado con <code>new Thread(...)</code>, pero aún no se ha llamado a <code>start()</code></td></tr>
    <tr><td><code>RUNNABLE</code></td><td>Está en marcha (o listo para que le toque)</td></tr>
    <tr><td><code>BLOCKED</code></td><td>Espera el <b>cerrojo</b> de un objeto <code>synchronized</code></td></tr>
    <tr><td><code>WAITING</code></td><td>Espera un aviso: <code>wait()</code> o <code>join()</code></td></tr>
    <tr><td><code>TIMED_WAITING</code></td><td>Espera un tiempo: <code>sleep()</code></td></tr>
    <tr><td><code>TERMINATED</code></td><td>Ha acabado su <code>run()</code></td></tr>
  </table>

--

<!-- html -->
  <h3>Cómo reconocer el interbloqueo</h3>
  <ul>
    <li>El programa <b>no termina</b> y <b>no escribe nada más</b></li>
    <li>Con <code>getState()</code>, los hilos implicados salen en <code>BLOCKED</code></li>
    <li>No es lo mismo que un hilo dormido: con <code>sleep()</code> el estado es <code>TIMED_WAITING</code> y <b>despierta solo</b></li>
  </ul>
  <p class="caja">Con <code>wait()</code> sin <code>notify()</code>, los hilos se quedan colgados en <code>WAITING</code>. Con interbloqueo, en <code>BLOCKED</code>. Los dos «cuelgan», pero por motivos distintos.</p>

---

<!-- html -->
  <h3>Cómo evitarlo: el mismo orden</h3>
  <p>El interbloqueo necesita una <b>espera en círculo</b>. Si todos piden los recursos <b>en el mismo orden</b>, no puede haber círculo.</p>
  <ul>
    <li class="fragment">Hilo 1: primero A, después B</li>
    <li class="fragment">Hilo 2: primero A, después B <span class="fragment">(antes: primero B y después A)</span></li>
    <li class="fragment">El que llega segundo se queda <b>esperando A</b> y no retiene nada: cuando el primero termina, entra</li>
  </ul>
  <p class="peque">Proyecto <b>InterbloqueoResuelto</b></p>

--

<!-- html -->
  <h3>Solución: un trabajo que pide dos ficheros</h3>
  {{codigo: InterbloqueoResuelto/Trabajo.java :: 12-24 @@ 3|9|10}}
  <ul class="peque">
    <li><code>synchronized (primero) { … }</code>: coge el cerrojo de ese objeto <b>mientras dura el bloque</b></li>
    <li>Dentro, otro <code>synchronized (segundo) { … }</code>: el segundo fichero</li>
    <li>Trabaja con los dos y, al cerrar las llaves, <b>suelta los dos cerrojos</b></li>
  </ul>

--

<!-- html -->
  <h3>Lo que cambia: el orden de los argumentos</h3>
  {{codigo: InterbloqueoResuelto/Principal.java :: 3-9 @@ 5-6}}
  <ul class="peque">
    <li>Los dos hilos reciben <code>(a, b)</code>: <b>primero A y después B</b></li>
    <li>Si el hilo 2 recibiera <code>(b, a)</code>, volvería el interbloqueo. <b>Solo cambia el orden</b></li>
  </ul>

--

<!-- html -->
  <h3>Otras formas de evitarlo</h3>
  <ul>
    <li><b>Menos cerrojos</b>: si un solo objeto protege los dos ficheros, no hay nada que esperar en círculo</li>
    <li><b>No retener</b>: soltar lo que se tiene antes de pedir otra cosa</li>
    <li><b>No esperar para siempre</b>: pedir el recurso con un tiempo máximo y rendirse si no llega (en Java, con la clase <code>ReentrantLock</code>; no la vemos aquí)</li>
    <li><b>Pensarlo antes</b>: dibujar quién pide qué y en qué orden</li>
  </ul>

---

<!-- html -->
  <h3>Errores típicos</h3>
  <ul>
    <li>Pensar que <code>sleep()</code> suelta el cerrojo: <b>no lo suelta</b>, solo <code>wait()</code> lo hace</li>
    <li>Que cada hilo pida los recursos <b>en orden distinto</b></li>
    <li>Creer que un programa parado es siempre un interbloqueo: también se queda parado si falta un <code>notify()</code></li>
    <li>Probarlo una vez, que salga bien, y darlo por bueno: el interbloqueo depende del <b>momento</b></li>
    <li>Llamar a <code>wait()</code> con un cerrojo y quedarse con otro: el otro <b>no se suelta</b></li>
  </ul>

--

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>En el ejemplo, ¿qué pasa si se quita el <code>Thread.sleep(1000)</code>? ¿Sigue habiendo interbloqueo siempre?</li>
    <li>¿Qué pasa si el hilo 2 también llama a <code>a.metodoA(b)</code>, igual que el hilo 1?</li>
    <li>Si solo hubiera un hilo, <code>metodoA</code> llama a <code>metodoB</code> y <code>metodoB</code> vuelve a llamar a <code>metodoA</code>. ¿Qué pasaría?</li>
    <li>¿Podría haber interbloqueo con <b>tres</b> hilos y <b>tres</b> recursos? ¿Cómo?</li>
    <li>¿Qué estado tiene un hilo que espera un <code>wait()</code> y qué estado tiene uno que espera un cerrojo?</li>
  </ol>
