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
    <p class="caja"><b>La tarea:</b> simular una cocina con <b>4 cocineros</b> y <b>5 cuchillos</b>. Cada cocinero coge un cuchillo y lo suelta. Todos lo hacen <b>4 veces</b>.</p>
    <p>Por pantalla: quién coge o suelta y cuántos cuchillos quedan libres.</p>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br>Cocinero 2 coge un cuchillo. Libres: 3<br>…<br>Cocinero 2 suelta el cuchillo. Libres: 5</div>
    <p class="peque">Proyecto <b>CocinaCuchillos</b>. Primero sin esperas; después haremos que cocinar tarde.</p>

--

<!-- html -->
    <h3>El esquema del programa</h3>
    <svg class="esquema" viewBox="0 0 1000 480" role="img" aria-label="Principal crea los hilos Cocinero, que usan la misma Cocina">
      <defs>
        <marker id="c1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="punta" d="M0 0 L10 5 L0 10 z"/></marker>
        <marker id="c2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="punta-aviso" d="M0 0 L10 5 L0 10 z"/></marker>
      </defs>
      <!-- Principal -->
      <rect class="clase" x="10" y="60" width="250" height="360" rx="14"/>
      <text class="tit" x="135" y="95" text-anchor="middle">Principal</text>
      <rect class="parte" x="28" y="115" width="214" height="290" rx="8"/>
      <text class="suave" x="40" y="143">main</text>
      <text class="cod" x="40" y="185">1 cocina</text>
      <text class="cod" x="40" y="225">4 hilos</text>
      <text class="cod" x="40" y="265">start()</text>
      <!-- Cocinero 1 -->
      <rect class="clase" x="370" y="10" width="260" height="120" rx="14"/>
      <text class="tit" x="500" y="40" text-anchor="middle">Cocinero 1</text>
      <text class="cod" x="388" y="72">cocina</text>
      <rect class="clave" x="470" y="52" width="148" height="30" rx="8"/>
      <text class="suave" x="544" y="73" text-anchor="middle">referencia</text>
      <rect class="parte" x="388" y="90" width="224" height="32" rx="8"/>
      <text class="cod" x="400" y="112">run(): coger, soltar</text>
      <text class="tit" x="500" y="248" text-anchor="middle" style="fill:var(--suave)">⋮</text>
      <!-- Cocinero 4 -->
      <rect class="clase" x="370" y="340" width="260" height="120" rx="14"/>
      <text class="tit" x="500" y="370" text-anchor="middle">Cocinero 4</text>
      <text class="cod" x="388" y="402">cocina</text>
      <rect class="clave" x="470" y="382" width="148" height="30" rx="8"/>
      <text class="suave" x="544" y="403" text-anchor="middle">referencia</text>
      <rect class="parte" x="388" y="420" width="224" height="32" rx="8"/>
      <text class="cod" x="400" y="442">run(): coger, soltar</text>
      <!-- Cocina -->
      <rect class="clase" x="740" y="60" width="250" height="360" rx="14" style="stroke:var(--aviso-borde)"/>
      <text class="tit" x="865" y="95" text-anchor="middle" style="fill:var(--aviso-borde)">Cocina</text>
      <text class="suave" x="758" y="135">recurso compartido</text>
      <text class="cod" x="758" y="175">libres = 5</text>
      <rect class="parte" x="758" y="205" width="214" height="75" rx="8"/>
      <text class="suave" x="770" y="230">método</text>
      <text class="cod" x="770" y="262">coger()</text>
      <rect class="parte" x="758" y="305" width="214" height="75" rx="8"/>
      <text class="suave" x="770" y="330">método</text>
      <text class="cod" x="770" y="362">soltar()</text>
      <!-- flechas: Principal crea los hilos -->
      <path class="flecha" d="M260 150 C310 150 320 70 366 70" marker-end="url(#c1)"/>
      <path class="flecha" d="M260 330 C310 330 320 400 366 400" marker-end="url(#c1)"/>
      <text class="suave" x="312" y="188" text-anchor="middle">crea</text>
      <text class="suave" x="312" y="208" text-anchor="middle">y arranca</text>
      <!-- flechas: todos usan la misma cocina -->
      <path class="flecha-aviso" d="M630 70 C685 70 690 150 736 150" marker-end="url(#c2)"/>
      <path class="flecha-aviso" d="M630 400 C685 400 690 330 736 330" marker-end="url(#c2)"/>
      <text class="suave" x="685" y="188" text-anchor="middle" style="fill:var(--aviso-borde)">la misma</text>
      <text class="suave" x="685" y="208" text-anchor="middle" style="fill:var(--aviso-borde)">cocina</text>
    </svg>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Qué comparten los cocineros? <span class="fragment">La <b>cocina</b>: un solo objeto <code>Cocina</code> con los cuchillos libres.</span></li>
      <li>¿Alguien tiene que esperar? <span class="fragment">No: hay 5 cuchillos y solo 4 cocineros.</span></li>
      <li>¿Entonces hace falta <code>synchronized</code>? <span class="fragment">Sí: la <b>cuenta</b> de libres sigue siendo un dato compartido y se puede estropear.</span></li>
    </ul>

--

<!-- html -->
    <h3>La cocina: Cocina</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|3|5-7|9-12|14-17" style="font-size:.6em; white-space:pre-wrap">
public class Cocina {

    private int libres;

    public Cocina(int cuchillos) {
        libres = cuchillos;
    }

    public synchronized void coger() {
        libres--;
        System.out.println(Thread.currentThread().getName() + " coge un cuchillo. Libres: " + libres);
    }

    public synchronized void soltar() {
        libres++;
        System.out.println(Thread.currentThread().getName() + " suelta el cuchillo. Libres: " + libres);
    }
}
    </code></pre>
    <ul class="peque">
      <li><code>libres</code> es el dato compartido. El constructor recibe cuántos cuchillos hay.</li>
      <li><code>coger()</code> resta 1 y <code>soltar()</code> suma 1. Los dos son <code>synchronized</code>: solo un cocinero a la vez cambia la cuenta.</li>
    </ul>

--

<!-- html -->
    <h3>El cocinero: Cocinero</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|3|5-7|9-15|11|12|13">
public class Cocinero implements Runnable {

    private Cocina cocina;

    public Cocinero(Cocina cocina) {
        this.cocina = cocina;
    }

    @Override
    public void run() {
        for (int i = 1; i &lt;= 4; i++) {
            cocina.coger();
            cocina.soltar();
        }
    }
}
    </code></pre>
    <ul class="peque">
      <li>El <code>for</code> repite 4 veces: coger un cuchillo y soltarlo.</li>
    </ul>

--

<!-- html -->
    <h3>Los hilos y Principal</h3>
    <pre><code class="language-java" data-trim data-line-numbers="4|6-8" style="font-size:.6em; white-space:pre-wrap">
public class Principal {

    public static void main(String[] args) {
        Cocina cocina = new Cocina(5);

        for (int i = 1; i &lt;= 4; i++) {
            new Thread(new Cocinero(cocina), "Cocinero " + i).start();
        }
    }
}
    </code></pre>
    <ul class="peque">
      <li>Se crea <b>una sola</b> cocina con 5 cuchillos. Los 4 cocineros reciben ese mismo objeto.</li>
      <li>El <code>for</code> crea y arranca un hilo por cocinero con el método <code>start()</code> de la clase <code>Thread</code>.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br>Cocinero 1 suelta el cuchillo. Libres: 5<br>Cocinero 2 coge un cuchillo. Libres: 4<br>…<br>Cocinero 4 suelta el cuchillo. Libres: 5</div>
    <p class="aviso">Termina al instante y al final quedan <b>5</b> libres. Pero cocinar no es instantáneo.</p>
    <p class="fragment caja">Ahora cada cocinero tiene que <b>tardar 3 segundos</b> con el cuchillo. ¿Cómo se hace que un hilo tarde?</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>sleep(ms)</code>: duerme el hilo esos milisegundos. <code>sleep(3000)</code> son 3 segundos. Simula que algo tarda.</p></div>
    </div>

--

<!-- html -->
    <h3>¿Qué pasa al escribirlo?</h3>
    <p>Escribimos <code>sleep(3000);</code> en el programa. La línea sale subrayada en rojo, dos veces seguidas por dos motivos distintos.</p>
    <div class="nuevo fragment">
    <div class="nuevo-item"><span class="etiqueta">Error 1</span><p><code>cannot find symbol</code>: Java no sabe de dónde sale <code>sleep</code>. Hay que decírselo con un <code>import static</code> arriba del fichero.</p></div>
    </div>
    <div class="nuevo fragment">
    <div class="nuevo-item"><span class="etiqueta">Error 2</span><p><code>InterruptedException</code>: Java lo lanza si despiertan al hilo mientras duerme. Por eso <code>sleep</code> obliga a escribir un <code>try</code> con <code>catch</code>. Si no lo escribes, el editor marca error: <code>unreported exception InterruptedException; must be caught or declared to be thrown</code>.</p></div>
    </div>
    <p class="fragment caja">Los dos se arreglan con la <b>bombilla</b> de NetBeans.</p>

--

<!-- html -->
    <h3>La bombilla: arreglar el error 1</h3>
    <p>Junto a la línea del <code>sleep</code>, en el margen izquierdo, aparece una <b>bombilla</b>.</p>
    <ol class="peque">
      <li class="fragment">Pulsa la bombilla, o pon el cursor en la línea y pulsa <code>Alt+Enter</code>.</li>
      <li class="fragment">Elige la opción que empieza por <b>Add import for static ... sleep</b>.</li>
      <li class="fragment">NetBeans escribe arriba del fichero, tras la línea <code>package</code>: <code>import static java.lang.Thread.sleep;</code></li>
    </ol>
    <p class="fragment aviso">Con este <code>import</code> se escribe <code>sleep(3000);</code> directamente. Ese error desaparece, pero queda el otro.</p>

--

<!-- html -->
    <h3>La bombilla: arreglar el error 2</h3>
    <p>La línea sigue en rojo: falta tratar la <code>InterruptedException</code>.</p>
    <ol class="peque">
      <li class="fragment">Pulsa otra vez la bombilla, o <code>Alt+Enter</code>.</li>
      <li class="fragment">Elige <b>Surround Statement with try-catch</b>.</li>
      <li class="fragment">NetBeans escribe el <code>try</code> y el <code>catch (InterruptedException ex)</code> y el rojo desaparece.</li>
    </ol>
    <p class="fragment aviso">No elijas <b>Add throws clause</b>: el método <code>run()</code> de un <code>Runnable</code> no puede declarar esa excepción.</p>

--

<!-- html -->
    <h3>Lo que escribe la bombilla</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|2|3-4|4" style="font-size:.6em; white-space:pre-wrap">
try {
    sleep(3000);
} catch (InterruptedException ex) {
    Logger.getLogger(Cocina.class.getName()).log(Level.SEVERE, null, ex);
}
    </code></pre>
    <ul class="peque">
      <li>El <code>try</code> y el <code>catch</code> son los de siempre; la variable se llama <code>ex</code> en vez de <code>e</code>.</li>
      <li>La línea de <code>Logger</code> apunta el error en el registro de NetBeans. Para este ejercicio se puede <b>borrar</b> y dejar el <code>catch</code> vacío.</li>
      <li>Al borrarla, los dos <code>import</code> de <code>Logger</code> y <code>Level</code> que añadió NetBeans sobran: también se pueden borrar.</li>
    </ul>

--

<!-- html -->
    <h3>Primer intento: dormir dentro de coger()</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|2-3|4-8|4|5|6-7" style="font-size:.6em; white-space:pre-wrap">
public synchronized void coger() {
    libres--;
    System.out.println(Thread.currentThread().getName() + " coge un cuchillo. Libres: " + libres);
    try {
        sleep(3000);
    } catch (InterruptedException e) {
    }
}
    </code></pre>
    <ul class="peque">
      <li><code>try</code> intenta ejecutar lo de dentro. Si el hilo se despierta por la fuerza, Java salta al <code>catch</code>; aquí lo dejamos vacío porque no pasa nada.</li>
      <li>Con este <code>try</code>/<code>catch</code> el error desaparece.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br><i>(3 segundos)</i><br>Cocinero 1 suelta el cuchillo. Libres: 5<br>Cocinero 2 coge un cuchillo. Libres: 4<br><i>(3 segundos)</i><br>…</div>
    <p class="aviso">Los cocineros van <b>de uno en uno</b> y el programa tarda unos <b>48 segundos</b> (16 cuchillos cogidos, 3 segundos cada uno).</p>
    <p class="fragment caja">Hay 5 cuchillos y solo 4 cocineros: ¿por qué esperan unos a otros?</p>
    <p class="fragment">Porque <code>coger()</code> es <code>synchronized</code> y el cocinero <b>duerme dentro</b>: mientras duerme, los demás no pueden ni entrar al método, aunque queden cuchillos libres.</p>

--

<!-- html -->
    <h3>Segundo intento: dormir en Cocinero</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|5-9|13|14|15-18|19">
import static java.lang.Thread.sleep;

public class Cocinero implements Runnable {

    private Cocina cocina;

    public Cocinero(Cocina cocina) {
        this.cocina = cocina;
    }

    @Override
    public void run() {
        for (int i = 1; i &lt;= 4; i++) {
            cocina.coger();
            try {
                sleep(3000);
            } catch (InterruptedException e) {
            }
            cocina.soltar();
        }
    }
}
    </code></pre>
    <ul class="peque">
      <li>Quitamos el <code>sleep</code> de <code>Cocina</code> y lo ponemos en el hilo, entre <code>coger()</code> y <code>soltar()</code>.</li>
      <li>El <code>sleep</code> queda <b>fuera</b> de los métodos <code>synchronized</code>: mientras uno cocina, los otros pueden coger su cuchillo.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br>Cocinero 2 coge un cuchillo. Libres: 3<br>Cocinero 3 coge un cuchillo. Libres: 2<br>Cocinero 4 coge un cuchillo. Libres: 1<br>Cocinero 1 suelta el cuchillo. Libres: 2<br>…<br>Cocinero 2 suelta el cuchillo. Libres: 5</div>
    <p class="aviso">Ahora los cuatro cogen a la vez y el programa tarda unos <b>12 segundos</b> (4 vueltas de 3). Al final quedan <b>5</b> libres.</p>
    <p class="fragment caja">Antes tardaba 48 segundos. Regla: el <code>sleep</code> va <b>fuera</b> de <code>synchronized</code>.</p>

--

<!-- html -->
    <h3>Una pregunta</h3>
    <p class="caja">Ahora hay <b>7 cocineros</b> y solo <b>5 cuchillos</b>.</p>
    <ul>
      <li>¿Qué crees que va a pasar? <span class="fragment">Piénsalo antes de probarlo.</span></li>
      <li class="fragment">Cambia el <code>for</code> de <code>Principal</code> a 7 cocineros y ejecuta.</li>
      <li class="fragment">¿Cuántos cuchillos libres dice el programa? ¿Tiene sentido?</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué ha pasado?</h3>
    <div class="salida">Cocinero 6 coge un cuchillo. Libres: -1<br>Cocinero 7 coge un cuchillo. Libres: -2</div>
    <p class="aviso">Los cocineros 6 y 7 cogen cuchillos que <b>no existen</b>. <code>coger()</code> resta 1 sin mirar si queda alguno.</p>
    <p class="fragment caja">¿Cómo lo arreglamos? Un cocinero que no encuentra cuchillo tiene que <b>esperar</b> a que otro suelte uno.</p>

--

<!-- html -->
    <h3>La idea</h3>
    <ul>
      <li>Si <code>libres</code> vale 0, el cocinero se <b>queda esperando</b> dentro de <code>coger()</code>.</li>
      <li class="fragment">Cuando otro cocinero <b>suelta</b> un cuchillo, <b>avisa</b> a los que esperan.</li>
      <li class="fragment">Los que esperan se despiertan y <b>vuelven a mirar</b> si ya hay un cuchillo.</li>
    </ul>
    <p class="fragment peque">Como una cola en la puerta de la cocina: el que no encuentra cuchillo espera, y el que termina avisa.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>wait()</code> de la clase <code>Object</code>: el hilo se <b>duerme hasta que lo avisen</b> y suelta el cerrojo mientras espera, así otro hilo puede entrar en el método <code>synchronized</code>. Obliga a escribir <code>try</code> y <code>catch (InterruptedException e)</code>, como <code>sleep</code>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>notifyAll()</code> de la clase <code>Object</code>: <b>despierta</b> a todos los hilos que esperan con <code>wait()</code> en ese mismo objeto.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p>Los dos métodos solo se pueden usar dentro de un método <code>synchronized</code>, y todas las clases los tienen. Se escribe <code>wait()</code> a secas, sin nada delante.</p></div>
    </div>

--

<!-- html -->
    <h3>Cocina: coger() espera</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|2|3-7|8|9" style="font-size:.6em; white-space:pre-wrap">
public synchronized void coger() {
    while (libres == 0) {
        try {
            wait();
        } catch (InterruptedException e) {
        }
    }
    libres--;
    System.out.println(Thread.currentThread().getName() + " coge un cuchillo. Libres: " + libres);
}
    </code></pre>
    <ul class="peque">
      <li><code>while (libres == 0)</code>: mientras no haya cuchillos, el cocinero se queda en el bucle.</li>
      <li><code>wait()</code> lo duerme y suelta el cerrojo: si no lo soltara, nadie podría entrar en <code>soltar()</code> y esperaría para siempre. El <code>try</code>/<code>catch</code> lo escribe la bombilla.</li>
      <li>Solo cuando hay algún cuchillo, el bucle termina y <code>libres--</code> lo coge.</li>
    </ul>

--

<!-- html -->
    <h3>Cocina: soltar() avisa</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1|2-3|4" style="font-size:.6em; white-space:pre-wrap">
public synchronized void soltar() {
    libres++;
    System.out.println(Thread.currentThread().getName() + " suelta el cuchillo. Libres: " + libres);
    notifyAll();
}
    </code></pre>
    <ul class="peque">
      <li>Suma 1 a <code>libres</code> y lo muestra, como antes.</li>
      <li><code>notifyAll()</code> despierta a los cocineros que esperan en <code>coger()</code>. Cada uno vuelve a mirar el <code>while</code>: uno encuentra el cuchillo y lo coge; los demás ven <code>libres == 0</code> y vuelven a esperar.</li>
    </ul>

--

<!-- html -->
    <h3>¿Por qué while y no if?</h3>
    <p>Con <code>notifyAll()</code> se despiertan <b>todos</b> los que esperan, pero solo hay <b>un</b> cuchillo nuevo.</p>
    <ul class="peque">
      <li class="fragment">Con <code>if</code>, todos pasarían a <code>libres--</code> sin volver a mirar y <code>libres</code> volvería a quedar negativo.</li>
      <li class="fragment">Con <code>while</code>, cada cocinero que se despierta <b>comprueba otra vez</b> si queda un cuchillo antes de cogerlo.</li>
    </ul>
    <p class="fragment caja">Regla: <code>wait()</code> siempre dentro de un <code>while</code> que repite la condición.</p>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Cocinero 1 coge un cuchillo. Libres: 4<br>…<br>Cocinero 5 coge un cuchillo. Libres: 0<br>Cocinero 1 suelta el cuchillo. Libres: 1<br>Cocinero 6 coge un cuchillo. Libres: 0<br>…<br>Cocinero 6 suelta el cuchillo. Libres: 5</div>
    <p class="aviso"><code>libres</code> nunca baja de 0 y al final quedan <b>5</b>. Cada cocinero hace sus 4 vueltas, y el programa tarda más que antes (unos 20 segundos): los dos cocineros que sobran esperan su turno.</p>

---

<!-- html -->
  <h3>Probarlo en el simulador</h3>
  <p>Con la cocina y el parking puedes ver los hilos funcionando: cuchillos que se cogen y se sueltan, hilos que esperan y se despiertan.</p>
  <ul>
    <li>Arrastra o pulsa las piezas para escribir <code>synchronized</code>, <code>while</code>, <code>wait()</code> y <code>notifyAll()</code></li>
    <li>Quita el <code>while</code> o el <code>notifyAll()</code> y mira <b>qué falla</b></li>
    <li>Cambia los contadores (cocineros, cuchillos, <code>sleep</code>) y ejecuta varias veces: el orden cambia, el resultado correcto no</li>
  </ul>
  <p class="aviso"><a href="../../simulador/index.html#cocina" target="_blank" rel="noopener">Abrir el simulador de hilos</a> (se abre en otra pestaña).</p>

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
    <li>Una cocina con 4 cocineros y 5 cuchillos: dormir dentro de <code>synchronized</code> hace que esperen todos (48 s) y fuera tardan 12 s; con más cocineros que cuchillos, <code>wait()</code> y <code>notifyAll()</code> evitan los cuchillos negativos</li>
    <li>Sincronizar da el resultado correcto, pero los hilos pasan de uno en uno por esos métodos</li>
  </ul>
