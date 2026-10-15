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
  <p>Una caja con <b>un solo hueco</b>. El pintor deja un cuadro en el hueco. El vendedor lo saca para venderlo.</p>
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
    <p class="aviso">Repaso de 6.3: <code>synchronized</code>, <code>wait()</code> y <code>notifyAll()</code> funcionan igual que en la cocina.</p>

---

<!-- html -->
  <h3>Ejercicio 1: un pintor y un vendedor</h3>
  <ul>
    <li>El almacén solo admite <b>un cuadro</b></li>
    <li>El pintor espera a que el almacén esté <b>vacío</b> para dejar un cuadro</li>
    <li>El vendedor espera a que haya un cuadro para <b>venderlo</b></li>
    <li>Termina al vender 10 cuadros</li>
  </ul>
  <div class="salida">Pintor: deja el cuadro 1<br>Vendedor: vende el cuadro 1<br>Pintor: deja el cuadro 2<br>…</div>
  <p class="peque">Proyecto <b>PintorVendedor</b></p>

--

<!-- html -->
  <h3>Cómo pensarlo</h3>
  <ul>
    <li>¿Quién es el objeto que comparten? <span class="fragment">El almacén. Será una clase: <code>Almacen</code>.</span></li>
    <li>¿Cómo sabe el almacén si está lleno? <span class="fragment">Un <code>boolean</code>: <code>hayCuadro</code>.</span></li>
    <li>¿Qué es distinto de la cocina? <span class="fragment">Aquí hay <b>dos papeles</b>: el pintor espera si está lleno y el vendedor espera si está vacío.</span></li>
  </ul>

--

<!-- html -->
  <h3>Solución: el almacén</h3>
  {{codigo: PintorVendedor/Almacen.java @@ 3|5|6|7-10|12-14|17-27}}

--

<!-- html -->
  <h3>Línea por línea (1)</h3>
  <ul class="peque">
    <li><code>private boolean hayCuadro = false;</code><br>Un <code>boolean</code> solo vale <code>true</code> o <code>false</code>. Empieza en <code>false</code>: el almacén está vacío.</li>
    <li><code>public synchronized void depositar(int numero)</code><br>Método del pintor. <code>synchronized</code>: si el pintor está dentro, el vendedor espera fuera.</li>
    <li><code>while (hayCuadro)</code><br>«Mientras el almacén esté lleno…» repite el bloque.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea (2)</h3>
  <ul class="peque">
    <li><code>wait();</code><br>El pintor se <b>duerme</b> y <b>suelta el almacén</b>, para que el vendedor pueda entrar a sacar el cuadro.</li>
    <li><code>try { … } catch (InterruptedException e) { }</code><br>Igual que con el <code>wait()</code> de la cocina.</li>
    <li><code>hayCuadro = true;</code><br>Ya se puede dejar el cuadro: el almacén pasa a estar lleno.</li>
    <li><code>notify();</code><br>Método de la clase <code>Object</code>: «¡Despierta, vendedor, ya hay un cuadro!»</li>
  </ul>

--

<!-- html -->
  <h3>El método vender: al revés</h3>
  <ul class="peque">
    <li><code>while (!hayCuadro)</code><br>El <code>!</code> significa «no». Espera mientras <b>no</b> haya cuadro.</li>
    <li><code>hayCuadro = false;</code><br>Saca el cuadro: el almacén queda vacío.</li>
    <li><code>notify();</code><br>Método de la clase <code>Object</code>. Despierta al pintor: ya hay sitio.</li>
  </ul>

--

<!-- html -->
  <h3>Repaso: <code>while</code> y no <code>if</code></h3>
  <p class="caja">Como en la cocina: al despertar, el hilo <b>vuelve a mirar</b> la condición. Aquí importa más cuando hay dos vendedores.</p>

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
Almacen almacen = new Almacen();

Thread pintor = new Thread(new Pintor(almacen), "Pintor");
Thread vendedor = new Thread(new Vendedor(almacen), "Vendedor");

pintor.start();
vendedor.start();
  </code></pre>
  <ul class="peque">
    <li>Se crea <b>un solo</b> almacén. Si cada hilo tuviera el suyo, no se comunicarían</li>
    <li>Los dos hilos reciben ese mismo objeto</li>
  </ul>

--

<!-- html -->
  <h3>¿Qué sale en pantalla?</h3>
  <div class="salida">Pintor: deja el cuadro 1<br>Vendedor: vende el cuadro 1<br>Pintor: deja el cuadro 2<br>Vendedor: vende el cuadro 2<br>…<br>Pintor: deja el cuadro 10<br>Vendedor: vende el cuadro 10</div>
  <p class="caja">Ahora <b>sí sale siempre igual</b>. En 6.1 el orden variaba; aquí los hilos se esperan.</p>

---

<!-- html -->
  <h3>Ejercicio 2: un pintor y dos vendedores</h3>
  <ul>
    <li>Un pintor y <b>dos</b> vendedores, con el mismo almacén de un cuadro</li>
    <li>Cada cuadro lo vende <b>un solo</b> vendedor</li>
    <li>Termina cuando se han pintado y vendido los 10 cuadros</li>
  </ul>
  <p class="peque">Proyecto <b>PintorDosVendedores</b></p>

--

<!-- html -->
  <h3>Un problema nuevo y uno conocido</h3>
  <ol>
    <li><b>Hay tres hilos esperando.</b> Con <code>notify()</code> despierta uno cualquiera: puede ser el equivocado y el pintor se queda dormido para siempre.<br><span class="fragment">Como en la cocina: <code>notifyAll()</code>.</span></li>
    <li class="fragment"><b>¿Cuándo dejan de esperar los vendedores?</b> Ninguno sabe cuántos cuadros le tocan. <b>Esto es nuevo.</b><br><span class="fragment">Solución: el almacén apunta si el pintor ha <code>terminado</code>.</span></li>
  </ol>

--

<!-- html -->
  <h3>Solución: el almacén</h3>
  {{codigo: PintorDosVendedores/Almacen.java @@ 3-5|17|20|21|27-29|30-33|36-39}}

--

<!-- html -->
  <h3>Línea por línea</h3>
  <ul class="peque">
    <li><code>private int cuadro</code><br>Guarda el número del cuadro que hay en el almacén, para mostrarlo al venderlo.</li>
    <li><code>notifyAll()</code><br>Método de la clase <code>Object</code>. Despierta a <b>todos</b>. Cada uno vuelve a mirar su condición; el que no puede seguir se duerme otra vez.</li>
    <li><code>public synchronized boolean vender()</code><br>Ahora devuelve <code>true</code> si ha vendido y <code>false</code> si ya no queda nada.</li>
    <li><code>while (!hayCuadro &amp;&amp; !terminado)</code><br><code>&amp;&amp;</code> significa «y». Espera mientras no haya cuadro <b>y</b> el pintor siga pintando.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea (2)</h3>
  <ul class="peque">
    <li><code>if (!hayCuadro) { return false; }</code><br>Si salimos del <code>while</code> y no hay cuadro, es que el pintor terminó. <code>return</code> sale del método y entrega <code>false</code>.</li>
    <li><code>return true;</code><br>Ha vendido un cuadro.</li>
    <li><code>terminar()</code><br>Método de la clase <code>Almacen</code>. Lo llama el pintor al acabar: pone <code>terminado</code> a <code>true</code> y despierta a los vendedores que seguían esperando.</li>
  </ul>
  <p class="aviso">Se mira primero si hay cuadro. Si el pintor deja el último y termina enseguida, ese cuadro <b>se vende igualmente</b>.</p>

--

<!-- html -->
  <h3>Solución: el vendedor</h3>
  {{codigo: PintorDosVendedores/Vendedor.java @@ 11|12-14}}
  <ul class="peque">
    <li>Repite mientras el método <code>vender()</code> de la clase <code>Almacen</code> diga <code>true</code></li>
    <li>Cuando dice <code>false</code>, el <code>while</code> acaba y el hilo termina</li>
    <li>El <code>Pintor</code> es como antes, pero al final del <code>for</code> llama a <code>almacen.terminar()</code></li>
  </ul>

--

<!-- html -->
  <h3>Crear los hilos</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1|3-5|7-9">
Almacen almacen = new Almacen();

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
  <div class="salida">Pintor: deja el cuadro 1<br>Vendedor 1: vende el cuadro 1<br>Pintor: deja el cuadro 2<br>Vendedor 2: vende el cuadro 2<br>…</div>
  <p class="aviso">Los cuadros del 1 al 10 se venden <b>una sola vez</b>, pero <b>quién</b> vende cada uno cambia entre ejecuciones. A veces vende uno solo todos. Ambas cosas son correctas.</p>

---

<!-- html -->
  <h3>Errores típicos</h3>
  <ul>
    <li>Usar <code>notify()</code> con dos vendedores: a veces funciona y a veces se cuelga</li>
    <li>Olvidar <code>terminar()</code>: los vendedores esperan para siempre y el programa <b>no termina</b></li>
    <li>Mirar <code>terminado</code> antes que <code>hayCuadro</code>: se pierde el último cuadro</li>
    <li>Crear un almacén por hilo: nadie se comunica</li>
  </ul>

--

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>Quita el <code>wait()</code> del vendedor del ejercicio 1. ¿Qué pasa?</li>
    <li>En el ejercicio 2, ¿se reparten los cuadros por igual?</li>
    <li>¿Qué pasa si el pintor no llama a <code>terminar()</code>?</li>
    <li>Con un pintor y un vendedor, ¿vale <code>notify()</code>? ¿Y con tres hilos?</li>
  </ol>
