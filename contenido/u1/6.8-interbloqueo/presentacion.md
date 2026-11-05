<!-- html -->
  <h2>Interbloqueo</h2>
  <p>PSP · 2º DAM · Apartado 6.8</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li><b>Ejecutar</b> un programa que se queda parado sin dar ningún error</li>
    <li>Entender <b>por qué</b> se para: el <b>interbloqueo</b> (en inglés, <i>deadlock</i>)</li>
    <li>Descubrir <b>cinco maneras</b> de arreglarlo y <b>probarlas todas</b></li>
    <li>Saber cuándo conviene cada una</li>
  </ul>
  <p class="caja">Hoy se trabaja así: primero <b>pensamos</b> (yo pregunto, vosotros contestáis), después <b>lo probáis vosotros</b> en NetBeans.</p>

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
  <h3>Ana, Luis, la pala y el cubo</h3>
  <div class="escena-ib">
    <div class="nino">
      <div class="dichos"><span class="dicho fragment" data-fragment-index="1">«Dame el cubo»</span><span class="dicho no fragment" data-fragment-index="2">«No suelto la pala»</span></div>
      <span class="cara fragment sacude" data-fragment-index="3">👧</span>
      <b>Ana</b>
      <span class="cosa fragment sacude" data-fragment-index="3">⛏️ pala</span>
    </div>
    <div class="nino">
      <div class="dichos"><span class="dicho fragment" data-fragment-index="1">«Dame la pala»</span><span class="dicho no fragment" data-fragment-index="2">«No suelto el cubo»</span></div>
      <span class="cara fragment sacude" data-fragment-index="3">👦</span>
      <b>Luis</b>
      <span class="cosa fragment sacude" data-fragment-index="3">🪣 cubo</span>
    </div>
  </div>
  <p class="aviso fragment" data-fragment-index="3">⏳ Los dos esperan <b>para siempre</b>. Eso es un <b>interbloqueo</b>.</p>
  <p class="caja fragment" data-fragment-index="4"><b>Pregunta:</b> ¿qué tendría que pasar para que no se quedaran así? Pensadlo, lo vamos a necesitar dentro de un rato.</p>

--

<!-- html -->
  <div class="nuevo">
  <h3>Lo nuevo de hoy</h3>
  <div class="nuevo-item"><span class="etiqueta">Concepto</span><p><b>Interbloqueo</b>: dos o más hilos esperan cada uno algo que tiene otro, y ninguno puede avanzar.</p></div>
  <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>synchronized (objeto) { … }</code>: coge el cerrojo de ese objeto <b>solo durante el bloque</b>, en vez de en todo el método.</p></div>
  <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>getState()</code> de la clase <code>Thread</code>: devuelve el <b>estado</b> del hilo. Un hilo que espera el cerrojo de un objeto está en <code>BLOCKED</code>.</p></div>
  <div class="nuevo-item"><span class="etiqueta">Más adelante</span><p>Un cerrojo con <b>tiempo máximo</b>: <code>ReentrantLock</code> y <code>tryLock()</code> (solo en el último ejercicio).</p></div>
  </div>
  <p class="aviso">Repaso: <code>synchronized</code>, <code>sleep()</code>, <code>this</code>, <code>Runnable</code> y <code>throws</code> funcionan igual que en 6.4, 6.5 y 6.6.</p>

---

<!-- html -->
  <h3>Ejercicio 1 · Descarga y ejecuta (10 min)</h3>
  <p>Descargad el proyecto, abridlo en NetBeans y ejecutadlo. <b>No lo leáis todavía</b>: primero mirad qué hace.</p>
  <p class="caja">⬇️ <a href="Interbloqueo.zip"><b>Interbloqueo.zip</b></a></p>
  <ul>
    <li>Esperad unos <b>10 segundos</b>, sin tocar nada</li>
    <li>¿Termina? ¿Sale algún <b>error</b>?</li>
    <li>¿En qué <b>estado</b> está cada hilo?</li>
    <li>¿Qué <b>fichero</b> tiene cada hilo y cuál está <b>esperando</b>?</li>
  </ul>
  <p class="peque">Está todo en el enunciado, ejercicio 1.</p>

---

<!-- html -->
  <h3>¿Qué ha salido?</h3>
  <div class="salida">Hilo 1 tiene A<br>Hilo 2 tiene B<br>Hilo 1 pide B<br>Hilo 2 pide A<br>Hilo 1: BLOCKED<br>Hilo 2: BLOCKED<br>▮ (el programa no termina)</div>
  <ul class="peque">
    <li>El orden de las dos primeras líneas puede cambiar. Lo que no cambia es el final</li>
    <li>En NetBeans, el botón de ejecución sigue activo: hay que detenerlo a mano</li>
  </ul>
  <p class="caja fragment"><b>No hay ningún error.</b> El programa simplemente se queda parado: eso es lo que hace tan difícil encontrarlo.</p>

--

<!-- html -->
  <h3>Vamos a pensarlo paso a paso</h3>
  <ol>
    <li><b>¿Quién tiene A?</b> <span class="fragment">El hilo 1, y no lo suelta</span></li>
    <li><b>¿Quién tiene B?</b> <span class="fragment">El hilo 2, y no lo suelta</span></li>
    <li><b>¿Qué pide el hilo 1?</b> <span class="fragment">B, que tiene el hilo 2 → espera</span></li>
    <li><b>¿Qué pide el hilo 2?</b> <span class="fragment">A, que tiene el hilo 1 → espera</span></li>
    <li><b>¿Quién puede soltar algo primero?</b> <span class="fragment">Nadie. Los dos esperan al otro: <b>un círculo</b></span></li>
  </ol>

--

<!-- html -->
  <h3>El círculo</h3>
  <svg viewBox="0 0 640 240" style="width:80%;max-height:46vh">
    <defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>
    <rect x="20" y="20" width="150" height="70" rx="10" fill="none" stroke="currentColor" stroke-width="3"/><text x="95" y="62" text-anchor="middle" font-size="26" fill="currentColor">Hilo 1</text>
    <rect x="470" y="20" width="150" height="70" rx="10" fill="none" stroke="currentColor" stroke-width="3"/><text x="545" y="62" text-anchor="middle" font-size="26" fill="currentColor">Hilo 2</text>
    <rect x="20" y="150" width="150" height="70" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><text x="95" y="192" text-anchor="middle" font-size="26" fill="currentColor">Fichero A</text>
    <rect x="470" y="150" width="150" height="70" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><text x="545" y="192" text-anchor="middle" font-size="26" fill="currentColor">Fichero B</text>
    <line x1="80" y1="150" x2="80" y2="92" stroke="#22c55e" stroke-width="3"/><text x="40" y="125" font-size="18" fill="#22c55e">lo tiene</text>
    <line x1="560" y1="150" x2="560" y2="92" stroke="#22c55e" stroke-width="3"/><text x="568" y="125" font-size="18" fill="#22c55e">lo tiene</text>
    <line x1="172" y1="55" x2="466" y2="170" stroke="#ef4444" stroke-width="3" marker-end="url(#fl)" stroke-dasharray="8 5"/>
    <line x1="468" y1="55" x2="174" y2="170" stroke="#ef4444" stroke-width="3" marker-end="url(#fl)" stroke-dasharray="8 5"/>
    <text x="320" y="52" text-anchor="middle" font-size="18" fill="#ef4444">espera</text>
  </svg>
  <p class="peque">Flechas verdes: <b>lo tiene</b>. Flechas rojas: <b>lo espera</b>. Se cruzan: hay un círculo, y nadie sale.</p>

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
  <p class="caja fragment">Con <code>wait()</code> sin <code>notify()</code> los hilos se quedan en <code>WAITING</code>. Con interbloqueo, en <code>BLOCKED</code>. Los dos «cuelgan», pero por motivos distintos.</p>

---

<!-- html -->
  <h3>Ahora sí: el código</h3>
  <p class="peque">Cada hilo es un <code>Trabajo</code> que necesita los dos ficheros a la vez.</p>
  {{codigo: Interbloqueo/Trabajo.java :: 12-26 @@ 3|4-8|9|10-12}}
  <ul class="peque">
    <li><b>1.</b> Coge el cerrojo del <b>primer</b> fichero</li>
    <li><b>2.</b> Lo dice y espera un segundo <b>sin soltarlo</b> (<code>sleep()</code> no suelta nada)</li>
    <li><b>3.</b> Dice qué fichero va a pedir</li>
    <li><b>4.</b> Pide el cerrojo del <b>segundo</b>, mientras sigue con el primero</li>
  </ul>

--

<!-- html -->
  <h3>Y quién pide qué</h3>
  {{codigo: Interbloqueo/Principal.java :: 7-10 @@ 1|2}}
  <ul class="peque">
    <li>El hilo 1 recibe <code>(a, b)</code>: <b>primero A y después B</b></li>
    <li>El hilo 2 recibe <code>(b, a)</code>: <b>primero B y después A</b></li>
    <li>Son los mismos dos objetos para los dos hilos, y cada uno pide en <b>orden contrario</b></li>
  </ul>

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
  <p class="fragment caja">Si evitamos <b>una sola</b>, no hay interbloqueo. Hoy probamos cinco formas de hacerlo.</p>

--

<!-- html -->
  <h3>¿Cuál quitarías primero?</h3>
  <p>Mirad las cuatro condiciones y pensad por parejas (1 minuto).</p>
  <ul>
    <li class="fragment"><b>Exclusión mutua</b>: ¿podemos quitarla? <span class="fragment">No. Sin <code>synchronized</code> vuelve la condición de carrera de 6.3. Los ficheros tienen que ser de uno en uno</span></li>
    <li class="fragment"><b>Espera en círculo</b>: ¿cómo se deshace un círculo? <span class="fragment">Haciendo que no sea un círculo → <b>ejercicios 2, 3 y 5</b></span></li>
    <li class="fragment"><b>Retener y esperar</b>: ¿y si no se retiene nada? <span class="fragment">→ <b>ejercicio 4</b></span></li>
    <li class="fragment"><b>Sin quitárselo</b>: ¿y si el hilo se rinde y suelta lo que tiene? <span class="fragment">→ <b>ejercicio 6 (reto)</b></span></li>
  </ul>

---

<!-- html -->
  <h3>Solución 1 · Piensa</h3>
  <p>Mirad el dibujo del círculo y las cuatro condiciones. Hay <b>un hilo que pide A primero</b> y otro que pide <b>B primero</b>.</p>
  <p class="caja"><b>Pregunta:</b> ¿qué pasaría si los <b>dos</b> pidieran <b>primero A</b> y después B?</p>
  <ol>
    <li class="fragment">Los dos quieren A. Uno la consigue (digamos el hilo 1)</li>
    <li class="fragment">El hilo 2 <b>espera A</b>, y <b>no tiene nada cogido</b></li>
    <li class="fragment">El hilo 1 pide B: está libre, <b>la consigue</b>, trabaja y suelta los dos</li>
    <li class="fragment">El hilo 2 entra y hace lo mismo. <b>Nadie espera en círculo</b></li>
  </ol>
  <p class="aviso fragment">Regla: si todos piden los recursos <b>en el mismo orden</b>, no puede haber círculo.</p>

--

<!-- html -->
  <h3>Ejercicio 2 · El mismo orden (5 min)</h3>
  <p>Copiad el proyecto <code>Interbloqueo</code> con el nombre <code>InterbloqueoOrden</code>.</p>
  <ul>
    <li>Arreglad el interbloqueo cambiando <b>lo mínimo posible</b></li>
    <li>Los dos hilos terminan, y <code>main</code> los muestra en <code>TERMINATED</code></li>
    <li>Pista: ¿dónde se decide el orden en que cada hilo recibe los ficheros?</li>
  </ul>
  <p class="peque">Pistas y ayudas en el enunciado, ejercicio 2.</p>

--

<!-- html -->
  <h3>Solución 1 · Comprobamos</h3>
  {{codigo: InterbloqueoOrden/Principal.java :: 7-10 @@ 2}}
  <ul class="peque">
    <li>Solo cambia <b>una línea</b>: el hilo 2 recibe <code>(a, b)</code>, igual que el 1</li>
    <li>Si lo dejáis como estaba, <b>vuelve el interbloqueo</b>: es solo cuestión de orden</li>
    <li><b>Ventaja:</b> no hay que cambiar nada más. <b>Inconveniente:</b> depende de que <b>todos</b> los que usan los ficheros pidan en el mismo orden. Un solo despiste y vuelve</li>
  </ul>

---

<!-- html -->
  <h3>Solución 2 · Piensa</h3>
  <p>Ahora el orden <b>no se puede cambiar</b>: un hilo pide <code>(a, b)</code> y el otro <code>(b, a)</code>.</p>
  <p class="caja"><b>Pregunta:</b> ahora hay <b>dos</b> cerrojos, uno por fichero. ¿Y si hubiera <b>uno solo</b> para los dos ficheros?</p>
  <ul>
    <li class="fragment">Quien tenga el cerrojo, tiene <b>los dos ficheros a la vez</b></li>
    <li class="fragment">El otro hilo espera <b>a tener todo</b>, no a coger uno y esperar por el otro</li>
    <li class="fragment">Ya no se puede quedar con la mitad: <b>no hay círculo</b></li>
  </ul>
  <p class="aviso fragment">¿Cómo se hace? Un objeto nuevo que no es ninguno de los ficheros y que solo sirve de cerrojo. Los dos hilos tienen que recibir <b>el mismo</b>.</p>

--

<!-- html -->
  <h3>Ejercicio 3 · Un solo cerrojo (6 min)</h3>
  <p>Copiad el proyecto <code>Interbloqueo</code> con el nombre <code>InterbloqueoUnCerrojo</code>.</p>
  <ul>
    <li>Los hilos <b>siguen recibiendo</b> <code>(a, b)</code> y <code>(b, a)</code></li>
    <li>Los dos usan los dos ficheros a la vez y terminan uno detrás de otro</li>
    <li>Necesitáis un objeto <code>Object</code> que se crea <b>una sola vez</b> y llega a los dos trabajos</li>
  </ul>
  <p class="peque">Pistas y ayudas en el enunciado, ejercicio 3.</p>

--

<!-- html -->
  <h3>Solución 2 · Comprobamos</h3>
  {{codigo: InterbloqueoUnCerrojo/Trabajo.java :: 14-26 @@ 3|9-10}}
  <ul class="peque">
    <li><code>synchronized (candado)</code>: un <b>único</b> cerrojo para todo. Ya no hay <code>synchronized</code> por fichero</li>
    <li>En <code>Principal</code> se crea <b>un</b> <code>Object candado</code> y se entrega a los dos trabajos</li>
    <li><b>Ventaja:</b> sirve aunque cada uno pida en un orden. <b>Inconveniente:</b> aunque pidan ficheros distintos, <b>esperan igual</b> (menos paralelismo)</li>
  </ul>

---

<!-- html -->
  <h3>Solución 3 · Piensa</h3>
  <p>Volvemos a dos cerrojos y a pedir en orden contrario. La condición que atacamos ahora es otra.</p>
  <p class="caja"><b>Pregunta:</b> ¿qué hacía el hilo 1 cuando se quedaba esperando B? <span class="fragment">Tenía A <b>cogida</b> a la vez. Eso es «retener y esperar»</span></p>
  <ul>
    <li class="fragment"><b>¿Y si usa A, la suelta, y solo después pide B?</b></li>
    <li class="fragment">Mientras espera B, <b>no tiene nada cogido</b>: nadie espera por él</li>
    <li class="fragment">Nunca hay un hilo con una mano llena y la otra pidiendo</li>
  </ul>
  <p class="aviso fragment">¿Dónde está el <code>synchronized</code> que se queda abierto mientras se pide el otro? Hay que <b>cerrarlo antes</b>.</p>

--

<!-- html -->
  <h3>Ejercicio 4 · No retener (6 min)</h3>
  <p>Copiad el proyecto <code>Interbloqueo</code> con el nombre <code>InterbloqueoSoltar</code>.</p>
  <ul>
    <li>Los hilos <b>siguen recibiendo</b> <code>(a, b)</code> y <code>(b, a)</code></li>
    <li>Cada hilo usa los ficheros <b>de uno en uno</b>: nunca tiene uno mientras pide el otro</li>
    <li>Dos bloques <code>synchronized</code> <b>seguidos</b>, no uno dentro de otro</li>
  </ul>
  <p class="peque">Pistas y ayudas en el enunciado, ejercicio 4.</p>

--

<!-- html -->
  <h3>Solución 3 · Comprobamos</h3>
  {{codigo: InterbloqueoSoltar/Trabajo.java :: 12-26 @@ 3-9|10-13}}
  <ul class="peque">
    <li><b>Primer bloque:</b> coge el primer fichero, trabaja, y lo suelta al cerrar las llaves</li>
    <li><b>Segundo bloque:</b> después pide el segundo. Nunca tiene los dos a la vez</li>
    <li><b>Ventaja:</b> no hay ni círculo ni espera con algo en la mano. <b>Inconveniente:</b> solo vale si el trabajo <b>no necesita los dos ficheros a la vez</b>. Si los necesita juntos, no sirve</li>
  </ul>

---

<!-- html -->
  <h3>Solución 4 · Piensa</h3>
  <p>La solución 1 funcionaba, pero tenía un punto débil.</p>
  <p class="caja"><b>Pregunta:</b> ¿qué pasa si en un programa grande <b>alguien se equivoca</b> y pasa los ficheros en orden contrario?</p>
  <ul>
    <li class="fragment">Vuelve el interbloqueo, y <b>sin ningún error</b></li>
    <li class="fragment">¿Podemos hacer que el programa <b>no se pueda equivocar</b>?</li>
    <li class="fragment">Idea: cada fichero lleva un <b>número</b>, y <b>quien los usa</b> los ordena por número antes de pedirlos</li>
  </ul>
  <p class="aviso fragment">Así, pasen los ficheros como pasen, <b>siempre se piden en el mismo orden</b>.</p>

--

<!-- html -->
  <h3>Ejercicio 5 · El orden lo pone el programa (7 min)</h3>
  <p>Copiad el proyecto <code>Interbloqueo</code> con el nombre <code>InterbloqueoNumeros</code>.</p>
  <ul>
    <li>Los hilos <b>siguen recibiendo</b> <code>(a, b)</code> y <code>(b, a)</code>, y usan los dos ficheros a la vez</li>
    <li>Cada fichero tiene un <b>número</b>: A el 1 y B el 2</li>
    <li><code>Trabajo</code> pide siempre <b>primero el número más bajo</b>, le lleguen como le lleguen</li>
  </ul>
  <p class="peque">Pistas y ayudas en el enunciado, ejercicio 5.</p>

--

<!-- html -->
  <h3>Solución 4 · Comprobamos</h3>
  {{codigo: InterbloqueoNumeros/Trabajo.java :: 6-14 @@ 1|2-4|5-7}}
  <ul class="peque">
    <li>El constructor recibe los ficheros <b>en cualquier orden</b> (<code>uno</code> y <code>otro</code>)</li>
    <li>Compara los números: guarda en <code>primero</code> el más bajo y en <code>segundo</code> el otro</li>
    <li>El resto de <code>run()</code> queda <b>igual</b> que en el programa original</li>
    <li><b>Ventaja:</b> el orden no depende de quien crea los hilos. <b>Inconveniente:</b> hay que numerar <b>todos</b> los recursos y respetar siempre la regla</li>
  </ul>

---

<!-- html -->
  <h3>Solución 5 · Piensa (reto)</h3>
  <p>La última condición que queda: <b>«sin quitárselo»</b>. Nadie le arrebata el fichero al hilo que lo tiene.</p>
  <p class="caja"><b>Pregunta:</b> si nadie se lo puede quitar, ¿puede el propio hilo <b>rendirse</b> y soltarlo?</p>
  <ul>
    <li class="fragment">Pide el segundo fichero <b>diciendo cuánto está dispuesto a esperar</b> (por ejemplo, 1 segundo)</li>
    <li class="fragment">Si llega a tiempo: trabaja, suelta los dos y termina</li>
    <li class="fragment">Si no llega: <b>suelta el primero</b>, espera un rato al azar y <b>lo reintenta</b></li>
  </ul>
  <p class="aviso fragment">El «rato al azar» evita que los dos hilos reintenten justo a la vez y se vuelvan a bloquear.</p>

--

<!-- html -->
  <h3>Lo que necesitas: ReentrantLock</h3>
  <ul class="peque">
    <li><code>ReentrantLock</code>: un cerrojo que se pide y se suelta a mano, <b>sin</b> <code>synchronized</code></li>
    <li><code>lock()</code>: pide el cerrojo y espera hasta tenerlo</li>
    <li><code>tryLock(1, TimeUnit.SECONDS)</code>: lo pide y espera <b>como mucho 1 segundo</b>. Devuelve <code>true</code> si lo consigue y <code>false</code> si no</li>
    <li><code>unlock()</code>: suelta el cerrojo. <b>Hay que soltarlo siempre</b></li>
  </ul>
  <p class="caja">Es como <code>synchronized</code>, pero con una salida si el cerrojo no llega.</p>

--

<!-- html -->
  <h3>Ejercicio 6 (reto) · Tiempo máximo (10 min)</h3>
  <p>Copiad el proyecto <code>Interbloqueo</code> con el nombre <code>InterbloqueoTiempo</code>.</p>
  <ul>
    <li>Cada <code>Fichero</code> guarda su propio <code>ReentrantLock</code></li>
    <li>Si el segundo fichero no llega en 1 segundo: <b>suelta el primero, espera al azar y reintenta</b></li>
    <li>Los dos hilos terminan. Puede haber algún reintento antes</li>
  </ul>
  <p class="peque">Si no os da tiempo, no pasa nada. Pistas y ayudas en el enunciado, ejercicio 6.</p>

--

<!-- html -->
  <h3>Solución 5 · Comprobamos</h3>
  {{codigo: InterbloqueoTiempo/Trabajo.java :: 16-39 @@ 5-8|9-14|15-18}}
  <ul class="peque">
    <li>Se repite en un <code>while</code> hasta que consigue los dos ficheros</li>
    <li>Si <code>tryLock()</code> falla: <b>suelta el primero</b> y duerme un tiempo al azar</li>
    <li><b>Ventaja:</b> se recupera solo y no depende del orden. <b>Inconveniente:</b> más código, hay que soltar <b>a mano</b> y los hilos pueden reintentar muchas veces</li>
  </ul>

---

<!-- html -->
  <h3>¿Cuál uso?</h3>
  <table class="peque">
    <tr><th>Solución</th><th>Condición que rompe</th><th>Mejor cuando…</th></tr>
    <tr><td>1 · Mismo orden</td><td>Espera en círculo</td><td>Controlas todo el código que pide los recursos</td></tr>
    <tr><td>2 · Un solo cerrojo</td><td>Espera en círculo</td><td>Los recursos van siempre juntos y no importa esperar</td></tr>
    <tr><td>3 · No retener</td><td>Retener y esperar</td><td>El trabajo no necesita los dos recursos a la vez</td></tr>
    <tr><td>4 · Orden por número</td><td>Espera en círculo</td><td>Muchos recursos y mucha gente tocando el código</td></tr>
    <tr><td>5 · Tiempo máximo</td><td>Sin quitárselo</td><td>No puedes asegurar el orden y puedes repetir el trabajo</td></tr>
  </table>
  <p class="caja fragment">En la práctica, lo más usado es la 1 y la 4: <b>pedir siempre en el mismo orden</b>.</p>

--

<!-- html -->
  <h3>Para decidir (por parejas, 2 minutos)</h3>
  <ol>
    <li>Un banco pasa dinero de la cuenta X a la cuenta Y. A la vez, otro hilo pasa de Y a X. Hay que bloquear <b>las dos cuentas</b> a la vez. ¿Qué solución usas? <span class="fragment">La 4: ordenar las cuentas por su número, y bloquear siempre primero la de número más bajo</span></li>
    <li>Un hilo imprime un informe con dos ficheros, pero <b>lee uno y después el otro</b>, sin necesitarlos juntos. ¿Cuál? <span class="fragment">La 3: no retener, usar uno, soltarlo y pedir el otro</span></li>
    <li>Un programa pide un recurso externo que a veces tarda muchísimo, y repetir el trabajo no cuesta nada. ¿Cuál? <span class="fragment">La 5: tiempo máximo y reintento</span></li>
  </ol>

---

<!-- html -->
  <h3>Errores típicos</h3>
  <ul>
    <li>Pensar que <code>sleep()</code> suelta el cerrojo: <b>no lo suelta</b>, solo <code>wait()</code> lo hace</li>
    <li>Que cada hilo pida los recursos <b>en orden distinto</b></li>
    <li>Creer que un programa parado es siempre un interbloqueo: también se queda parado si falta un <code>notify()</code></li>
    <li>Probarlo una vez, que salga bien, y darlo por bueno: el interbloqueo depende del <b>momento</b></li>
    <li>Quitar los <code>synchronized</code> para que no se bloquee: desaparece el bloqueo, pero <b>vuelve la condición de carrera</b></li>
    <li>Con <code>ReentrantLock</code>: <b>olvidar</b> el <code>unlock()</code> en algún camino. El cerrojo se queda cogido para siempre</li>
  </ul>

--

<!-- html -->
  <h3>Para pensar en casa</h3>
  <ol>
    <li>En el ejemplo, ¿qué pasa si se quita el <code>Thread.sleep(1000)</code>? ¿Sigue habiendo interbloqueo siempre?</li>
    <li>¿Podría haber interbloqueo con <b>tres</b> hilos y <b>tres</b> recursos? ¿Cómo?</li>
    <li>En la solución 4, ¿qué pasa si dos ficheros tienen el <b>mismo</b> número?</li>
    <li>En la solución 5, ¿qué pasaría si el tiempo de espera fuera de 0 segundos? ¿Y si fuera enorme?</li>
    <li>¿Qué estado tiene un hilo que espera un <code>wait()</code> y qué estado tiene uno que espera un cerrojo?</li>
  </ol>
