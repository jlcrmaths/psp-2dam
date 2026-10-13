<!-- html -->
  <h2>Información compartida entre hilos</h2>
  <p>PSP · 2º DAM · Apartado 6.3</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Saber qué es un <b>recurso compartido</b></li>
    <li>Ver qué pasa cuando varios hilos usan el <b>mismo objeto</b></li>
    <li>Entender la <b>condición de carrera</b></li>
    <li>Comprobar que lo que parece correcto puede no serlo</li>
    <li>Saber por qué hace falta sincronizar</li>
  </ul>

---

<!-- html -->
    <h3>Hasta ahora, cada hilo iba a lo suyo</h3>
    <p>En 6.1 y 6.2 cada hilo hacía su trabajo sin tocar lo de los demás.</p>
    <p class="fragment">Ahora varios hilos van a <b>compartir un objeto</b>: todos leen y cambian el mismo dato.</p>


--

<!-- html -->
    <div class="nuevo">
    <h3>Recurso compartido</h3>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p>Un <b>recurso compartido</b> es un objeto o un dato que usan <b>varios hilos a la vez</b>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Ejemplos</span><p>Una cuenta bancaria, un fichero, una impresora, un contador, la caja de un supermercado.</p></div>
    <div class="nuevo-item"><span class="etiqueta">En Java</span><p>Se crea <b>un solo objeto</b> y se pasa <b>la misma referencia</b> a cada hilo, normalmente por el constructor.</p></div>
    </div>
    <p class="fragment caja">Hoy el recurso compartido es el jardín: la clase <code>RecursoJardin</code>.</p>

---

<!-- html -->
    <h3>El problema de los jardines</h3>
    <p>Un jardín tiene <b>100 personas</b>. Entran 1000 y salen 1000, todas a la vez.</p>
    <p class="fragment">Al final debería haber <b>100</b> otra vez.</p>
    <p class="fragment aviso">¿Saldrá siempre 100?</p>

--

<!-- html -->
    <h3>Ejercicio 1: los jardines</h3>
    <p>2000 hilos: 1000 entran (suman 1) y 1000 salen (restan 1). Cada hilo muestra su nombre y cuántas personas hay.</p>
    <div class="salida">hilo Entra1 ----- Entra en Jardín<br>101 en jardín<br>hilo Sale1 ----- Sale de Jardín<br>100 en jardín<br>…</div>
    <p class="caja">Ejecútalo varias veces y apunta qué sale.</p>
    <p class="peque">Proyecto <b>ProblemaJardines</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Qué comparten los hilos? <span class="fragment">El <b>jardín</b>: un solo objeto <code>RecursoJardin</code>.</span></li>
      <li>¿Cuántas clases de hilo? <span class="fragment">Dos: <code>EntraJardin</code> y <code>SaleJardin</code>.</span></li>
      <li>¿Cómo comprobamos el resultado? <span class="fragment">Cada hilo muestra la cuenta. El <b>último mensaje</b> debería decir 100.</span></li>
    </ul>

--

<!-- html -->
    <h3>El esquema del programa</h3>
    <svg class="esquema" viewBox="0 0 1000 480" role="img" aria-label="Principal crea los hilos EntraJardin y SaleJardin, que usan el mismo RecursoJardin">
      <defs>
        <marker id="p1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="punta" d="M0 0 L10 5 L0 10 z"/></marker>
        <marker id="p2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="punta-aviso" d="M0 0 L10 5 L0 10 z"/></marker>
      </defs>
      <!-- Principal -->
      <rect class="clase" x="10" y="60" width="250" height="360" rx="14"/>
      <text class="tit" x="135" y="95" text-anchor="middle">Principal</text>
      <rect class="parte" x="28" y="115" width="214" height="290" rx="8"/>
      <text class="suave" x="40" y="143">main</text>
      <text class="cod" x="40" y="185">1 jardín</text>
      <text class="cod" x="40" y="225">2000 hilos</text>
      <text class="cod" x="40" y="265">start()</text>
      <!-- EntraJardin -->
      <rect class="clase" x="370" y="20" width="260" height="170" rx="14"/>
      <text class="tit" x="500" y="52" text-anchor="middle">EntraJardin ×1000</text>
      <text class="cod" x="388" y="88">jardin</text>
      <rect class="clave" x="470" y="68" width="148" height="30" rx="8"/>
      <text class="suave" x="544" y="89" text-anchor="middle">referencia</text>
      <rect class="parte" x="388" y="112" width="224" height="62" rx="8"/>
      <text class="suave" x="400" y="132">run()</text>
      <text class="cod" x="400" y="159">incrementaCuenta()</text>
      <text class="tit" x="500" y="222" text-anchor="middle" style="fill:var(--suave)">⋮</text>
      <!-- SaleJardin -->
      <rect class="clase" x="370" y="250" width="260" height="170" rx="14"/>
      <text class="tit" x="500" y="282" text-anchor="middle">SaleJardin ×1000</text>
      <text class="cod" x="388" y="318">jardin</text>
      <rect class="clave" x="470" y="298" width="148" height="30" rx="8"/>
      <text class="suave" x="544" y="319" text-anchor="middle">referencia</text>
      <rect class="parte" x="388" y="342" width="224" height="62" rx="8"/>
      <text class="suave" x="400" y="362">run()</text>
      <text class="cod" x="400" y="389">decrementaCuenta()</text>
      <!-- RecursoJardin -->
      <rect class="clase" x="740" y="60" width="250" height="360" rx="14" style="stroke:var(--aviso-borde)"/>
      <text class="tit" x="865" y="95" text-anchor="middle" style="fill:var(--aviso-borde)">RecursoJardin</text>
      <text class="suave" x="758" y="135">recurso compartido</text>
      <text class="cod" x="758" y="175">cuenta = 100</text>
      <rect class="parte" x="758" y="205" width="214" height="75" rx="8"/>
      <text class="suave" x="770" y="230">método</text>
      <text class="cod" x="770" y="262">incrementaCuenta()</text>
      <rect class="parte" x="758" y="305" width="214" height="75" rx="8"/>
      <text class="suave" x="770" y="330">método</text>
      <text class="cod" x="770" y="362">decrementaCuenta()</text>
      <!-- flechas: Principal crea los hilos -->
      <path class="flecha" d="M260 150 C310 150 320 105 366 105" marker-end="url(#p1)"/>
      <path class="flecha" d="M260 330 C310 330 320 335 366 335" marker-end="url(#p1)"/>
      <text class="suave" x="312" y="238" text-anchor="middle">crea</text>
      <text class="suave" x="312" y="258" text-anchor="middle">y arranca</text>
      <!-- flechas: todos usan el mismo recurso -->
      <path class="flecha-aviso" d="M630 83 C685 83 690 150 736 150" marker-end="url(#p2)"/>
      <path class="flecha-aviso" d="M630 313 C685 313 690 250 736 250" marker-end="url(#p2)"/>
      <text class="suave" x="685" y="196" text-anchor="middle" style="fill:var(--aviso-borde)">el mismo</text>
      <text class="suave" x="685" y="216" text-anchor="middle" style="fill:var(--aviso-borde)">objeto</text>
    </svg>

--

<!-- html -->
    <h3>El jardín: RecursoJardin</h3>
    {{codigo: ProblemaJardines/RecursoJardin.java @@ 1|3|5-7|9-13}}

--

<!-- html -->
    <h3>RecursoJardin, línea por línea</h3>
    <ul class="peque">
      <li><code>private int cuenta;</code><br>El número de personas. Es el dato que comparten los 2000 hilos.</li>
      <li><code>cuenta = 100;</code><br>En el constructor, empieza con 100 personas.</li>
      <li><code>System.out.println("hilo " + ...)</code><br>Muestra qué hilo entra. El método <code>getName()</code> de la clase <code>Thread</code> da su nombre, y <code>currentThread()</code> dice cuál es el hilo que ejecuta esta línea.</li>
      <li><code>cuenta++;</code><br>Suma 1 a la cuenta. <code>cuenta--;</code> resta 1 en el método que sale.</li>
      <li><code>System.out.println(cuenta + " en jardín")</code><br>Muestra cuántas personas hay después del cambio.</li>
    </ul>

--

<!-- html -->
    <h3>Los hilos y Principal</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|3-5|7-9">
RecursoJardin jardin = new RecursoJardin();

for (int i = 1; i &lt;= 1000; i++) {
    new Thread(new EntraJardin(jardin), "Entra" + i).start();
}

for (int i = 1; i &lt;= 1000; i++) {
    new Thread(new SaleJardin(jardin), "Sale" + i).start();
}
    </code></pre>

--

<!-- html -->
    <h3>Principal, línea por línea</h3>
    <ul class="peque">
      <li>Se crea <b>un solo</b> jardín. Los 2000 hilos reciben ese mismo objeto.</li>
      <li>El primer <code>for</code> crea 1000 hilos que entran, con <code>new Thread(...)</code>, les da un nombre ("Entra1", "Entra2"...) y los arranca en la misma línea con el método <code>start()</code> de la clase <code>Thread</code>.</li>
      <li>El segundo <code>for</code> hace lo mismo con los 1000 hilos que salen.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">hilo Sale2 ----- Sale de Jardín<br>98 en jardín<br>hilo Entra1 ----- Entra en Jardín<br>99 en jardín<br>99 en jardín<br>…<br>hilo Sale1000 ----- Sale de Jardín<br>101 en jardín</div>
    <p class="aviso">Entran 1000 y salen 1000: el último mensaje debería decir 100. Y el registro tiene saltos raros. Todo <b>cambia</b> de una ejecución a otra.</p>

---

<!-- html -->
    <h3>Reflexionemos</h3>
    <ul>
      <li>¿Qué dice el último mensaje? <span class="fragment">¿Es 100? ¿Y en todas las ejecuciones?</span></li>
      <li class="fragment">Mirad el registro: un hilo que <b>sale</b> y la cuenta muestra 98, otra vez 99... ¿tiene sentido?</li>
      <li class="fragment">Cada hilo suma o resta 1. ¿Cómo puede salir un número que no cuadra?</li>
      <li class="fragment">Si hoy ha salido 100 al final, ¿estamos seguros de que <b>siempre</b> saldrá?</li>
      <li class="fragment">¿Qué creéis que pasa dentro del método <code>incrementaCuenta</code>?</li>
    </ul>
    <p class="fragment aviso">Pensadlo en parejas antes de seguir.</p>

--

<!-- html -->
    <h3>Una idea para recordarlo</h3>
    <p>Una pizarra con un número escrito. Muchas personas lo leen, calculan en su cabeza y lo borran para escribir el nuevo.</p>
    <p class="fragment">Si dos leen el mismo número a la vez, las dos escribirán el mismo resultado. Una de las dos <b>se pierde</b>.</p>

--

<!-- html -->
    <h3>Sumar 1 son tres pasos</h3>
    <p>Aunque se escriba en una línea, para el ordenador son tres pasos:</p>
    <ol>
      <li class="fragment"><b>Leer</b> la cuenta</li>
      <li class="fragment"><b>Calcular</b> el nuevo valor</li>
      <li class="fragment"><b>Guardar</b> la cuenta</li>
    </ol>
    <p class="fragment caja">Otro hilo puede colarse entre dos pasos.</p>

--

<!-- html -->
    <h3>Dos hilos a la vez</h3>
    <table class="peque">
      <tr><th>Hilo A (entra)</th><th>Hilo B (entra)</th><th>cuenta</th></tr>
      <tr><td>lee 100</td><td></td><td>100</td></tr>
      <tr class="fragment"><td></td><td>lee 100</td><td>100</td></tr>
      <tr class="fragment"><td>guarda 101</td><td></td><td>101</td></tr>
      <tr class="fragment"><td></td><td>guarda 101</td><td>101</td></tr>
    </table>
    <p class="fragment aviso">Han entrado dos personas, pero la cuenta solo sube una.</p>

--

<!-- html -->
    <h3>Condición de carrera</h3>
    <p>Cuando varios hilos leen y cambian el mismo dato, y el resultado depende de <b>quién llega antes</b>.</p>
    <p class="fragment">Lo peor: el programa no da error. A veces sale bien y a veces <b>mal</b>, y no se puede predecir.</p>
    <p class="fragment caja">Y ahora la pregunta: ¿cómo evitamos que dos hilos estén a la vez dentro de <code>incrementaCuenta</code>? Es el ejercicio 2.</p>
---

<!-- html -->
    <h3>Ejercicio 2: jardines sincronizados</h3>
    <p class="caja"><b>Lo que se pide:</b> el mismo programa, pero con el resultado y el registro siempre correctos.</p>
    <div class="salida">…<br>hilo Sale1000 ----- Sale de Jardín<br>100 en jardín</div>
    <p>En <b>todas</b> las ejecuciones el último mensaje dice 100, y cada hilo muestra su línea seguida de su cuenta. Solo cambia la clase <code>RecursoJardin</code>.</p>
    <p class="peque">Proyecto <b>JardinesSincronizado</b></p>

--

<!-- html -->
    <h3>Antes de ver la solución</h3>
    <ul>
      <li>¿Qué tendría que pasar para que no se cuelen dos hilos?</li>
      <li class="fragment">¿Qué método hay que proteger: solo uno o los dos?</li>
      <li class="fragment">¿Qué pierde el programa si los hilos pasan de uno en uno?</li>
    </ul>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>synchronized</code>: se escribe en la cabecera de un método. Solo deja entrar a un hilo a la vez; los demás esperan fuera.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p><b>Cerrojo</b>: cada objeto tiene uno. El hilo que entra en un método <code>synchronized</code> lo coge y lo suelta al salir.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p><b>Condición de carrera</b>: el resultado depende de qué hilo llega antes. La has visto en el ejercicio 1.</p></div>
    </div>
    <p class="fragment peque">Como una puerta de una sola persona: el que está dentro lee, calcula y guarda <b>sin que nadie se cuele</b>.</p>

--

<!-- html -->
    <h3>El jardín sincronizado</h3>
    {{codigo: JardinesSincronizado/RecursoJardin.java @@ 9|15|9-13}}

--

<!-- html -->
    <h3>Qué cambia, línea por línea</h3>
    <ul class="peque">
      <li><code>public synchronized void incrementaCuenta()</code><br>Solo un hilo a la vez puede ejecutar este método.</li>
      <li><code>public synchronized void decrementaCuenta()</code><br>Lo mismo aquí. Hace falta en <b>los dos</b>: quien entra y quien sale tocan la misma variable.</li>
      <li>El resto del código <b>no cambia</b>: ni los hilos, ni <code>Principal</code>.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">hilo Entra1 ----- Entra en Jardín<br>101 en jardín<br>hilo Sale1 ----- Sale de Jardín<br>100 en jardín<br>…<br>hilo Sale1000 ----- Sale de Jardín<br>100 en jardín</div>
    <p class="aviso">Ahora cada hilo muestra su línea y su cuenta <b>seguidas</b>, y el último mensaje dice 100 <b>siempre</b>. Los 2000 hilos pasan <b>uno detrás de otro</b> por los métodos del jardín.</p>
    <p class="fragment caja">Sincronizar da un resultado correcto, pero quita la ventaja de hacer varias cosas a la vez.</p>

---

<!-- html -->
    <h3>Ejercicio 3: los tornos del museo</h3>
    <p class="caja"><b>La tarea:</b> simular los accesos a un museo por parte de <b>4 tornos</b>. Cada torno realiza <b>20 accesos</b>.</p>
    <p>Por pantalla: el hilo que accede y la cuenta de accesos en ese momento.</p>
    <div class="salida">Torno 1 accede. Accesos: 1<br>Torno 1 accede. Accesos: 2<br>Torno 3 accede. Accesos: 3<br>…<br>Torno 2 accede. Accesos: 80</div>
    <p class="peque">Proyecto <b>MuseoTornos</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Qué comparten los 4 tornos? <span class="fragment">El <b>museo</b>: un solo objeto <code>Museo</code>.</span></li>
      <li>¿Cuántas clases de hilo? <span class="fragment">Una: <code>Torno</code>. Los cuatro hacen lo mismo.</span></li>
      <li>¿Qué pasa si dos tornos suman a la vez? <span class="fragment">Lo mismo que en el jardín: se pierden accesos.</span></li>
      <li>¿Cómo lo evitamos? <span class="fragment">Con <code>synchronized</code>, como en el ejercicio 2.</span></li>
    </ul>

--

<!-- html -->
    <h3>El museo: Museo</h3>
    {{codigo: MuseoTornos/Museo.java @@ 1|3|5-7|9-12}}

--

<!-- html -->
    <h3>Museo, línea por línea</h3>
    <ul class="peque">
      <li><code>private int cuenta;</code><br>Los accesos. Es el dato que comparten los 4 hilos.</li>
      <li><code>cuenta = 0;</code><br>En el constructor, el museo empieza sin accesos.</li>
      <li><code>public synchronized void accede()</code><br>Solo un torno a la vez puede estar dentro. Los demás esperan fuera.</li>
      <li><code>cuenta++;</code><br>Suma 1 acceso.</li>
      <li><code>System.out.println(...)</code><br>Muestra el nombre del hilo con <code>currentThread()</code> y <code>getName()</code> de la clase <code>Thread</code>, y la cuenta.</li>
    </ul>

--

<!-- html -->
    <h3>El torno: Torno</h3>
    {{codigo: MuseoTornos/Torno.java @@ 3|5-7|9-14|11-13}}
    <ul class="peque">
      <li>Recibe el museo por el constructor: los 4 tornos tienen <b>el mismo</b>.</li>
      <li>El método <code>run()</code> de la interfaz <code>Runnable</code> repite 20 veces la llamada a <code>accede()</code>.</li>
    </ul>

--

<!-- html -->
    <h3>Los hilos y Principal</h3>
    {{codigo: MuseoTornos/Principal.java @@ 4|6-8}}
    <ul class="peque">
      <li>Se crea <b>un solo</b> museo. Los 4 tornos reciben ese mismo objeto.</li>
      <li>El <code>for</code> crea cada hilo con <code>new Thread(...)</code>, le da un nombre ("Torno 1"...) y lo arranca con el método <code>start()</code> de la clase <code>Thread</code>.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Torno 1 accede. Accesos: 1<br>Torno 1 accede. Accesos: 2<br>Torno 2 accede. Accesos: 3<br>…<br>Torno 3 accede. Accesos: 80</div>
    <p class="aviso">Los tornos se <b>turnan</b> y el orden cambia en cada ejecución. Pero el último mensaje dice <b>80</b> siempre.</p>
    <p class="fragment caja">¿Y si quitamos <code>synchronized</code>? Pruébalo: ¿se nota algo?</p>

---

<!-- html -->
    <h3>Ejercicio 4: la cocina</h3>
    <p class="caja"><b>La tarea:</b> simular una cocina con <b>3 cocineros</b> y <b>5 cuchillos</b>. Cada cocinero coge un cuchillo durante <b>3 segundos</b> y lo suelta. Todos lo hacen <b>4 veces</b>.</p>
    <p>Por pantalla: quién coge o suelta y cuántos cuchillos quedan libres.</p>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br>Cocinero 2 coge un cuchillo. Libres: 3<br>…<br>Cocinero 2 suelta el cuchillo. Libres: 5</div>
    <p class="peque">Proyecto <b>CocinaCuchillos</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Qué comparten los cocineros? <span class="fragment">La <b>cocina</b>: un solo objeto <code>Cocina</code> con los cuchillos libres.</span></li>
      <li>¿Alguien tiene que esperar? <span class="fragment">No: hay 5 cuchillos y solo 3 cocineros. Pero la <b>cuenta</b> de libres sí se puede estropear.</span></li>
      <li>¿Cómo tarda 3 segundos? <span class="fragment">El hilo <b>duerme</b>.</span></li>
      <li>¿Dónde dormir? <span class="fragment">Fuera del método <code>synchronized</code>.</span></li>
    </ul>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>sleep(ms)</code> de la clase <code>Thread</code>: duerme el hilo esos milisegundos. <code>Thread.sleep(3000)</code> son 3 segundos. Simula que algo tarda.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Error</span><p><code>InterruptedException</code>: Java lo lanza si despiertan al hilo mientras duerme. Por eso <code>sleep</code> va dentro de un <code>try</code> con <code>catch</code>.</p></div>
    </div>
    <p class="fragment aviso">Regla: <code>sleep</code> va <b>fuera</b> de <code>synchronized</code>. Si un hilo duerme dentro, los demás no pueden ni entrar.</p>

--

<!-- html -->
    <h3>La cocina: Cocina</h3>
    {{codigo: CocinaCuchillos/Cocina.java @@ 3|5-7|9-12|14-17}}
    <ul class="peque">
      <li><code>libres</code> es el dato compartido. El constructor recibe cuántos cuchillos hay.</li>
      <li><code>coger()</code> resta 1 y <code>soltar()</code> suma 1. Los dos son <code>synchronized</code>: solo un cocinero a la vez cambia la cuenta.</li>
    </ul>

--

<!-- html -->
    <h3>El cocinero: Cocinero</h3>
    {{codigo: CocinaCuchillos/Cocinero.java @@ 3|5-7|11-18|12|13-16|17}}
    <ul class="peque">
      <li>El <code>for</code> repite 4 veces: coger, dormir 3 segundos y soltar.</li>
      <li>El <code>sleep</code> está <b>fuera</b> de <code>coger()</code> y <code>soltar()</code>: mientras uno cocina, los otros pueden coger su cuchillo.</li>
    </ul>

--

<!-- html -->
    <h3>Los hilos y Principal</h3>
    {{codigo: CocinaCuchillos/Principal.java @@ 4|6-8}}
    <ul class="peque">
      <li>Se crea <b>una sola</b> cocina con 5 cuchillos. Los 3 cocineros reciben ese mismo objeto.</li>
      <li>El <code>for</code> crea y arranca un hilo por cocinero con el método <code>start()</code> de la clase <code>Thread</code>.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br>Cocinero 2 coge un cuchillo. Libres: 3<br>Cocinero 3 coge un cuchillo. Libres: 2<br>Cocinero 1 suelta el cuchillo. Libres: 3<br>…<br>Cocinero 2 suelta el cuchillo. Libres: 5</div>
    <p class="aviso">Los tres cogen a la vez y el programa tarda unos <b>12 segundos</b> (4 vueltas de 3). Al final quedan <b>5</b> libres.</p>
    <p class="fragment caja">Si el <code>sleep</code> estuviera dentro de <code>coger()</code>, los cocineros irían de uno en uno y tardaría 36 segundos. ¿Por qué?</p>

---

<!-- html -->
  <h3>Resumen</h3>
  <ul>
    <li>Un <b>recurso compartido</b> es un objeto que usan varios hilos a la vez: todos reciben la misma referencia</li>
    <li>Sumar 1 son tres pasos: leer, calcular y guardar</li>
    <li>Si dos hilos se cuelan entre los pasos, se pierden cambios: <b>condición de carrera</b></li>
    <li>El registro sale desordenado y el resultado puede ser incorrecto, aunque a veces salga 100</li>
    <li>Los hilos se crean y se arrancan con <code>new Thread(...).start()</code>: aquí 2000 hilos sobre un solo jardín</li>
    <li>Se arregla con la palabra <code>synchronized</code> en los métodos del jardín: un solo hilo a la vez</li>
    <li>Los tornos de un museo: 4 hilos suman a la misma cuenta y, con <code>synchronized</code>, salen 80 accesos siempre</li>
    <li>Una cocina con 3 cocineros y 5 cuchillos: <code>synchronized</code> protege la cuenta y el <code>sleep</code> va fuera</li>
    <li>Sincronizar da el resultado correcto, pero los hilos pasan de uno en uno por esos métodos</li>
  </ul>
