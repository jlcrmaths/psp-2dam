<!-- html -->
  <h2>Comunicación entre hilos</h2>
  <p>PSP · 2º DAM · Apartado 6.4</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Hilos con <b>papeles distintos</b> que se esperan entre sí</li>
    <li>Cuándo basta <code>notify()</code> y cuándo hace falta <code>notifyAll()</code></li>
    <li>Cómo avisar a los que esperan de que <b>ya no habrá más</b></li>
    <li>Resolver el problema del pintor y los vendedores</li>
  </ul>

---

<!-- html -->
  <h3>De la cocina al almacén</h3>
  <p>En la cocina de 6.3, todos los cocineros hacían <b>lo mismo</b> y esperaban un cuchillo.</p>
  <p class="fragment">Hoy cada hilo tiene un <b>papel distinto</b>: uno espera a que el otro haga algo antes de poder seguir.</p>

--

<!-- html -->
  <h3>Una idea para recordarlo</h3>
  <p>Una estantería con <b>un solo hueco</b>. El pintor deja el cuadro en el hueco. El vendedor lo saca para venderlo.</p>
  <ul>
    <li class="fragment">Si el hueco está <b>lleno</b>, el pintor se sienta a esperar</li>
    <li class="fragment">Si el hueco está <b>vacío</b>, el vendedor se sienta a esperar</li>
    <li class="fragment">Cuando uno termina, le da un toque en el hombro al otro</li>
  </ul>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>notify()</code> de la clase <code>Object</code>: despierta a <b>uno</b> de los hilos que esperan. Con <code>notifyAll()</code>, de la cocina, se despertaba a todos.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Idea</span><p>Una <b>señal de fin</b>: un dato compartido que avisa a los que esperan de que ya no habrá más.</p></div>
    </div>
    <p class="aviso">Repaso de 6.3: <code>synchronized</code>, <code>wait()</code> y <code>notifyAll()</code> funcionan igual que en la cocina. El almacén cuenta cuadros como la cocina contaba cuchillos libres, y su capacidad llega por el constructor.</p>

---

<!-- html -->
  <h3>Ejercicio 1: un pintor y un vendedor</h3>
  <ul>
    <li>En el almacén cabe <b>1 cuadro</b></li>
    <li>El pintor espera si el almacén está <b>lleno</b></li>
    <li>El vendedor espera si el almacén está <b>vacío</b></li>
    <li>Termina al vender 10 cuadros</li>
  </ul>
  <div class="salida">Pintor: deja el cuadro 1. En el almacén: 1<br>Vendedor: vende el cuadro 1. En el almacén: 0<br>Pintor: deja el cuadro 2. En el almacén: 1<br>…</div>
  <p class="peque">Proyecto <b>PintorVendedor</b></p>

--

<!-- html -->
  <h3>Cómo pensarlo</h3>
  <ul>
    <li>¿Quién es el objeto que comparten? <span class="fragment">El almacén. Será una clase: <code>Almacen</code>.</span></li>
    <li>¿Cómo sabe el almacén si está lleno o vacío? <span class="fragment">Cuenta los cuadros, como la cocina contaba los cuchillos: un <code>int</code> llamado <code>numCuadros</code>. Y otro, <code>numMaxCuadros</code>, con los que caben.</span></li>
    <li>¿Qué es distinto de la cocina? <span class="fragment">Aquí hay <b>dos papeles</b>: el pintor espera si <code>numCuadros</code> llega a <code>numMaxCuadros</code> y el vendedor espera si <code>numCuadros</code> es 0.</span></li>
  </ul>

--

<!-- html -->
  <h3>Solución: el almacén</h3>
  {{codigo: PintorVendedor/Almacen.java @@ 3-4|6-8|10|11|12-15|17-19|22-32}}

--

<!-- html -->
  <h3>Línea por línea (1)</h3>
  <ul class="peque">
    <li><code>private int numCuadros = 0;</code> y <code>private int numMaxCuadros;</code><br>Cuántos cuadros hay (empieza en 0: vacío) y cuántos caben.</li>
    <li><code>public Almacen(int numMaxCuadros)</code><br>El constructor recibe cuántos cuadros caben, igual que <code>Cocina</code> recibía los cuchillos. En <code>Principal</code>: <code>new Almacen(1)</code>.</li>
    <li><code>public synchronized void depositar(int numero)</code><br>Método del pintor. <code>synchronized</code>: si el pintor está dentro, el vendedor espera fuera.</li>
    <li><code>while (numCuadros == numMaxCuadros)</code><br>«Mientras el almacén esté lleno…» repite el bloque.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea (2)</h3>
  <ul class="peque">
    <li><code>wait();</code><br>El pintor se <b>duerme</b> y <b>suelta el almacén</b>, para que el vendedor pueda entrar a sacar el cuadro.</li>
    <li><code>try { … } catch (InterruptedException e) { }</code><br>Igual que con el <code>wait()</code> de la cocina.</li>
    <li><code>numCuadros++;</code><br>Ya hay sitio: se suma un cuadro al almacén.</li>
    <li><code>notify();</code><br>Método de la clase <code>Object</code>: «¡Despierta, vendedor, ya hay un cuadro!»</li>
  </ul>

--

<!-- html -->
  <h3>El método vender: al revés</h3>
  <ul class="peque">
    <li><code>while (numCuadros == 0)</code><br>Espera mientras el almacén esté <b>vacío</b>.</li>
    <li><code>numCuadros--;</code><br>Saca un cuadro: se resta uno.</li>
    <li><code>notify();</code><br>Método de la clase <code>Object</code>. Despierta al pintor: ya hay sitio.</li>
  </ul>

--

<!-- html -->
  <h3>Repaso: <code>while</code> y no <code>if</code></h3>
  <p class="caja">Como en la cocina: al despertar, el hilo <b>vuelve a mirar</b> la condición. Aquí importa más cuando hay dos vendedores, y también cuando caben varios cuadros.</p>

--

<!-- html -->
  <h3>Solución: el pintor</h3>
  {{codigo: PintorVendedor/Pintor.java @@ 3|5-7|11-13}}
  <ul class="peque">
    <li>El almacén entra por el <b>constructor</b> y se guarda en un atributo</li>
    <li>El <code>for</code> deja 10 cuadros. Si el almacén está lleno, <code>depositar</code> lo hace esperar</li>
    <li><code>Vendedor</code> es igual, pero llama a <code>vender(i)</code></li>
  </ul>

--

<!-- html -->
  <h3>Crear los hilos</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1|3-4|6-7">
Almacen almacen = new Almacen(1);

Thread pintor = new Thread(new Pintor(almacen), "Pintor");
Thread vendedor = new Thread(new Vendedor(almacen), "Vendedor");

pintor.start();
vendedor.start();
  </code></pre>
  <ul class="peque">
    <li>Se crea <b>un solo</b> almacén, con capacidad para 1 cuadro. Si cada hilo tuviera el suyo, no se comunicarían</li>
    <li>Los dos hilos reciben ese mismo objeto</li>
  </ul>

--

<!-- html -->
  <h3>¿Qué sale en pantalla?</h3>
  <div class="salida">Pintor: deja el cuadro 1. En el almacén: 1<br>Vendedor: vende el cuadro 1. En el almacén: 0<br>Pintor: deja el cuadro 2. En el almacén: 1<br>Vendedor: vende el cuadro 2. En el almacén: 0<br>…<br>Vendedor: vende el cuadro 10. En el almacén: 0</div>
  <p class="caja">Con un solo hueco, <b>sale siempre igual</b>: los hilos se esperan y se alternan. Nunca hay más de 1 cuadro ni menos de 0.</p>

---

<!-- html -->
  <h3>Ejercicio 2: un pintor y dos vendedores</h3>
  <ul>
    <li>Un pintor y <b>dos</b> vendedores, con el mismo almacén de 1 cuadro</li>
    <li>Cada cuadro lo vende <b>un solo</b> vendedor</li>
    <li>Termina cuando se han pintado y vendido los 10 cuadros</li>
  </ul>
  <p class="peque">Proyecto <b>PintorDosVendedores</b></p>

--

<!-- html -->
  <h3>Un problema nuevo y uno conocido</h3>
  <ol>
    <li><b>Hay tres hilos esperando.</b> Con <code>notify()</code> despierta uno cualquiera: puede ser el equivocado y el pintor se queda dormido para siempre.<br><span class="fragment">Como en la cocina: <code>notifyAll()</code>.</span></li>
    <li class="fragment"><b>¿Cuándo dejan de esperar los vendedores?</b> Ninguno sabe cuántos cuadros le tocan. <b>Esto es nuevo.</b><br><span class="fragment">Solución: el almacén cuenta los cuadros <code>pintados</code> y <code>vendidos</code>.</span></li>
  </ol>

--

<!-- html -->
  <h3>Solución: el almacén</h3>
  {{codigo: PintorDosVendedores/Almacen.java @@ 3-6|19-20|22|26|32-39|42-44}}

--

<!-- html -->
  <h3>Línea por línea</h3>
  <ul class="peque">
    <li><code>private int numCuadrosPintados</code> y <code>numCuadrosVendidos</code><br>Cuentan los cuadros pintados y los vendidos hasta ahora. Empiezan en 0.</li>
    <li><code>numCuadrosPintados++;</code><br>El pintor suma uno cada vez que deja un cuadro.</li>
    <li><code>notifyAll()</code><br>Método de la clase <code>Object</code>. Despierta a <b>todos</b>. Cada uno vuelve a mirar su condición; el que no puede seguir se duerme otra vez.</li>
    <li><code>while (numCuadros == 0 &amp;&amp; numCuadrosPintados &lt; 10)</code><br><code>&amp;&amp;</code> significa «y». Espera mientras el almacén esté vacío <b>y</b> todavía falten cuadros por pintar.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea (2)</h3>
  <ul class="peque">
    <li><code>if (numCuadros &gt; 0) { … }</code><br>Si salimos del <code>while</code> y hay cuadros, se vende uno: <code>numCuadros--</code>, <code>numCuadrosVendidos++</code> y <code>notifyAll()</code>.</li>
    <li><code>else { … }</code><br>Si no hay cuadros, es que ya se pintaron los 10 y no habrá más. El vendedor lo dice y el método acaba.</li>
    <li><code>getCuadrosVendidos()</code><br>Método <code>synchronized</code> que devuelve cuántos se han vendido. Lo usa el <code>Vendedor</code> para saber si debe seguir.</li>
  </ul>
  <p class="aviso">Se mira primero si hay cuadros. Si el pintor deja el último y termina enseguida, ese cuadro <b>se vende igualmente</b>.</p>

--

<!-- html -->
  <h3>Solución: el vendedor</h3>
  {{codigo: PintorDosVendedores/Vendedor.java @@ 11-13}}
  <ul class="peque">
    <li>Repite mientras se hayan vendido menos de 10 cuadros</li>
    <li>Cuando se llega a 10, el <code>while</code> acaba y el hilo termina</li>
    <li>El <code>Pintor</code> es igual que en el ejercicio 1</li>
  </ul>

--

<!-- html -->
  <h3>Crear los hilos</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1|3-5|7-9">
Almacen almacen = new Almacen(1);

Thread pintor = new Thread(new Pintor(almacen), "Pintor");
Thread v1 = new Thread(new Vendedor(almacen), "Vendedor 1");
Thread v2 = new Thread(new Vendedor(almacen), "Vendedor 2");

pintor.start();
v1.start();
v2.start();
  </code></pre>
  <p class="peque">Un almacén, tres hilos. Los dos vendedores usan la <b>misma clase</b>, como los contadores de 6.1.</p>

--

<!-- html -->
  <h3>¿Qué sale en pantalla?</h3>
  <div class="salida">Pintor: deja el cuadro 1. En el almacén: 1<br>Vendedor 1: vende un cuadro. En el almacén: 0<br>Pintor: deja el cuadro 2. En el almacén: 1<br>Vendedor 2: vende un cuadro. En el almacén: 0<br>…</div>
  <p class="aviso">Se pintan y se venden <b>10 cuadros</b>, pero <b>quién</b> vende cada uno cambia entre ejecuciones. A veces vende uno solo todos. Ambas cosas son correctas.</p>

---

<!-- html -->
  <h3>Errores típicos</h3>
  <ul>
    <li>Usar <code>notify()</code> con dos vendedores: a veces funciona y a veces se cuelga</li>
    <li>No mirar <code>numCuadrosPintados</code> en el <code>while</code>: un vendedor espera para siempre y el programa <b>no termina</b></li>
    <li>Mirar los cuadros pintados antes que <code>numCuadros</code>: se pierde el último cuadro</li>
    <li>Crear un almacén por hilo: nadie se comunica</li>
  </ul>

--

<!-- html -->
  <h3>Probarlo en el simulador</h3>
  <p>Con el pintor y los vendedores verás el almacén llenarse y vaciarse, y cómo <code>notify()</code> avisa a un solo hilo y <code>notifyAll()</code> a todos.</p>
  <ul>
    <li>Arrastra o pulsa las piezas para escribir <code>synchronized</code>, <code>while</code>, <code>wait()</code> y <code>notifyAll()</code></li>
    <li>Quita el <code>while</code> o el <code>notifyAll()</code> y mira <b>qué falla</b></li>
    <li>El panel <b>Experimentos</b> te propone situaciones para ejecutar (y alguna para completar tú) y te dice si lo que has visto es lo esperado</li>
    <li>Prueba <code>notify()</code> en vez de <code>notifyAll()</code> con dos vendedores</li>
  </ul>
  <p class="aviso"><a href="../../simulador/index.html#pintor2&experimentos" target="_blank" rel="noopener">Abrir el simulador de hilos</a> (se abre en otra pestaña).</p>

---

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>Quita el <code>wait()</code> del vendedor del ejercicio 1. ¿Qué pasa?</li>
    <li>En el ejercicio 2, ¿se reparten los cuadros por igual?</li>
    <li>¿Qué pasa si el <code>while</code> de <code>vender()</code> no mira <code>numCuadrosPintados</code>?</li>
    <li>Con un pintor y un vendedor, ¿vale <code>notify()</code>? ¿Y con tres hilos?</li>
    <li>¿Qué cambia si en el almacén caben 3 cuadros? ¿Y 10?</li>
  </ol>
