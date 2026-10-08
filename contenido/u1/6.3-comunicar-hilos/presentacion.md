<!-- html -->
  <h2>Comunicación entre hilos</h2>
  <p>PSP · 2º DAM · Apartado 6.3</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Entender qué pasa cuando dos hilos <b>comparten</b> un objeto</li>
    <li>Hacer que un hilo <b>espere</b> a otro con <code>wait()</code></li>
    <li>Avisar con <code>notify()</code> y <code>notifyAll()</code></li>
    <li>Proteger el objeto con <code>synchronized</code></li>
    <li>Resolver el problema del pintor y los vendedores</li>
  </ul>

---

<!-- html -->
  <h3>Hasta ahora, hilos que no se hablan</h3>
  <p>En 6.1 cada hilo hacía lo suyo. No compartían nada.</p>
  <p class="fragment">Hoy los hilos <b>comparten un objeto</b> y tienen que <b>ponerse de acuerdo</b>: uno espera a que el otro haga algo.</p>

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
  <h3>Las piezas que vamos a usar</h3>
  <ul>
    <li><code>synchronized</code>: solo un hilo a la vez dentro del método</li>
    <li><code>wait()</code>: «me duermo hasta que me avisen»</li>
    <li><code>notify()</code>: «despierto a uno de los que esperan»</li>
    <li><code>notifyAll()</code>: «despierto a todos los que esperan»</li>
  </ul>
  <p class="aviso"><code>wait()</code>, <code>notify()</code> y <code>notifyAll()</code> solo se pueden llamar <b>dentro</b> de un método <code>synchronized</code>.</p>

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
    <li>¿Cómo saben pintor y vendedor que usan el <b>mismo</b> almacén? <span class="fragment">Reciben el mismo objeto por el constructor.</span></li>
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
    <li><code>try { … } catch (InterruptedException e) { }</code><br>Java obliga a escribirlo con <code>wait()</code>, por si alguien interrumpe la espera. Aquí no hacemos nada con ese aviso.</li>
    <li><code>hayCuadro = true;</code><br>Ya se puede dejar el cuadro: el almacén pasa a estar lleno.</li>
    <li><code>notify();</code><br>«¡Despierta, vendedor, ya hay un cuadro!»</li>
  </ul>

--

<!-- html -->
  <h3>El método vender: al revés</h3>
  <ul class="peque">
    <li><code>while (!hayCuadro)</code><br>El <code>!</code> significa «no». Espera mientras <b>no</b> haya cuadro.</li>
    <li><code>hayCuadro = false;</code><br>Saca el cuadro: el almacén queda vacío.</li>
    <li><code>notify();</code><br>Despierta al pintor: ya hay sitio.</li>
  </ul>

--

<!-- html -->
  <h3>¿Por qué <code>while</code> y no <code>if</code>?</h3>
  <p>Un hilo despertado <b>no tiene garantizado</b> que ya se pueda continuar. Puede que otro se le haya adelantado.</p>
  <p class="caja">Con <code>while</code> el hilo, al despertar, <b>vuelve a mirar</b> la condición. Si no se cumple, se duerme otra vez.</p>

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
  <h3>Dos problemas nuevos</h3>
  <ol>
    <li><b>Hay tres hilos esperando.</b> <code>notify()</code> despierta a <b>uno cualquiera</b>. Si despierta al vendedor equivocado, el pintor se queda dormido para siempre.<br><span class="fragment">Solución: <code>notifyAll()</code>.</span></li>
    <li class="fragment"><b>¿Cuándo dejan de esperar los vendedores?</b> Ninguno sabe cuántos cuadros le tocan.<br><span class="fragment">Solución: el almacén apunta si el pintor ha <code>terminado</code>.</span></li>
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
    <li><code>notifyAll()</code><br>Despierta a <b>todos</b>. Cada uno vuelve a mirar su condición; el que no puede seguir se duerme otra vez.</li>
    <li><code>public synchronized boolean vender()</code><br>Ahora devuelve <code>true</code> si ha vendido y <code>false</code> si ya no queda nada.</li>
    <li><code>while (!hayCuadro &amp;&amp; !terminado)</code><br><code>&amp;&amp;</code> significa «y». Espera mientras no haya cuadro <b>y</b> el pintor siga pintando.</li>
  </ul>

--

<!-- html -->
  <h3>Línea por línea (2)</h3>
  <ul class="peque">
    <li><code>if (!hayCuadro) { return false; }</code><br>Si salimos del <code>while</code> y no hay cuadro, es que el pintor terminó. <code>return</code> sale del método y entrega <code>false</code>.</li>
    <li><code>return true;</code><br>Ha vendido un cuadro.</li>
    <li><code>terminar()</code><br>Lo llama el pintor al acabar: pone <code>terminado</code> a <code>true</code> y despierta a los vendedores que seguían esperando.</li>
  </ul>
  <p class="aviso">Se mira primero si hay cuadro. Si el pintor deja el último y termina enseguida, ese cuadro <b>se vende igualmente</b>.</p>

--

<!-- html -->
  <h3>Solución: el vendedor</h3>
  {{codigo: PintorDosVendedores/Vendedor.java @@ 11|12-14}}
  <ul class="peque">
    <li>Repite mientras <code>vender()</code> diga <code>true</code></li>
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
    <li>Olvidar <code>notify()</code>: el otro hilo duerme para siempre y el programa <b>no termina</b></li>
    <li>Crear un almacén por hilo: nadie se comunica</li>
    <li>Llamar a <code>wait()</code> fuera de <code>synchronized</code>: <code>IllegalMonitorStateException</code></li>
    <li><code>if</code> en vez de <code>while</code>: un vendedor vende un cuadro que ya no está</li>
    <li>Usar <code>notify()</code> con dos vendedores: a veces funciona y a veces se cuelga</li>
  </ul>

--

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>Quita el <code>wait()</code> del vendedor del ejercicio 1. ¿Qué pasa?</li>
    <li>¿Por qué <code>while</code> y no <code>if</code>?</li>
    <li>En el ejercicio 2, ¿se reparten los cuadros por igual?</li>
    <li>¿Qué pasa si el pintor no llama a <code>terminar()</code>?</li>
  </ol>
