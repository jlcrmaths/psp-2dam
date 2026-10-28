<!-- html -->
  <h2>Comunicación entre hilos</h2>
  <p>PSP · 2º DAM · Apartado 6.4</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Hilos con <b>papeles distintos</b> que se esperan entre sí</li>
    <li>Cuándo basta <code>notify()</code> y cuándo hace falta <code>notifyAll()</code></li>
    <li>Cómo avisar a los que esperan de que <b>ya no habrá más</b>, de <b>dos formas</b> distintas</li>
    <li>Resolver el problema del pintor y los vendedores</li>
    <li>Y después, la tienda de bicis, que avisa de otra manera</li>
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
    <div class="nuevo-item"><span class="etiqueta">Idea</span><p>Una <b>señal de fin</b>: un dato compartido (aquí, los cuadros pintados y vendidos) que avisa a los que esperan de que ya no habrá más.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p>Un método <code>synchronized</code> que <b>devuelve un valor</b>, como <code>getCuadrosVendidos()</code>: el vendedor lo llama para saber si debe seguir.</p></div>
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
    <li><code>getCuadrosVendidos()</code><br>Método <code>synchronized</code> que devuelve cuántos se han vendido. <code>return numCuadrosVendidos;</code> entrega el valor a quien lo llama. Lo usa el <code>Vendedor</code> para saber si debe seguir. Es <code>synchronized</code> para no leer el contador mientras otro vendedor lo cambia.</li>
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
  <h3>Otra forma de avisar: la tienda de bicis</h3>
  <p>Unos <b>mecánicos</b> montan bicis y las dejan en un estante con sitio limitado. Unos <b>clientes</b> las cogen para llevárselas.</p>
  <ul>
    <li>Cada mecánico monta <b>4 bicis</b></li>
    <li>Los clientes <b>no saben</b> cuántas bicis habrá en total</li>
    <li>El programa tiene que acabar solo, con el estante vacío</li>
  </ul>
  <p class="aviso">Es el mismo problema de siempre: ¿cómo se entera el cliente de que <b>ya no vendrán más bicis</b>?</p>

--

<!-- html -->
  <h3>Dos formas de decir «ya no hay más»</h3>
  <ul class="peque">
    <li><b>Pintor y vendedores: contadores.</b><br>El almacén cuenta los cuadros pintados y vendidos. El vendedor mira <code>getCuadrosVendidos()</code> y <b>se para solo</b> al llegar a 10. Hace falta saber el total de antemano.</li>
    <li class="fragment"><b>Bicis: una bandera.</b><br>Cuando los mecánicos terminan, alguien <b>avisa</b>: <code>cerrar()</code>. El cliente no cuenta nada: <code>vender()</code> le devuelve <code>false</code> cuando ya no queda nada y la tienda está cerrada.</li>
  </ul>
  <p class="caja fragment">Las dos funcionan. La primera es más sencilla si el total se conoce. La segunda sirve cuando <b>nadie lo sabe</b>: solo se sabe cuándo acaban los que producen.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de la tienda de bicis</h3>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p>Una <b>bandera</b>: una variable <code>boolean</code> compartida (<code>cerrada</code>) que dice que la producción ha terminado.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p>Un método <code>synchronized</code> que devuelve <code>boolean</code>, como <code>vender()</code>: <code>true</code> si se ha vendido una bici y <code>false</code> si ya no quedan.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>join()</code> de la clase <code>Thread</code> <b>dos veces</b>, con <code>cerrar()</code> entre medias: primero se espera a los mecánicos y después a los clientes.</p></div>
    </div>

--

<!-- html -->
  <h3>El estante: montar y vender</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1-7|9-12|13-15|16-19">
public synchronized void montar() {
    while (bicis == maximo) {
        try { wait(); } catch (InterruptedException e) { }
    }
    bicis++;
    notifyAll();
}

public synchronized boolean vender() {
    while (bicis == 0 &amp;&amp; !cerrada) {
        try { wait(); } catch (InterruptedException e) { }
    }
    if (bicis == 0) {
        return false;
    }
    bicis--;
    vendidas++;
    notifyAll();
    return true;
}
  </code></pre>

--

<!-- html -->
  <h3>Línea por línea (1)</h3>
  <ul class="peque">
    <li><code>while (bicis == maximo)</code> en <code>montar()</code><br>El mecánico espera mientras el estante está <b>lleno</b>. <code>maximo</code> es <code>final</code>: no cambia nunca.</li>
    <li><code>bicis++;</code> y <code>notifyAll();</code><br>Deja la bici y avisa a los clientes, por si alguno esperaba una.</li>
    <li><code>while (bicis == 0 &amp;&amp; !cerrada)</code> en <code>vender()</code><br>El cliente espera mientras <b>no haya bicis</b> <b>y</b> la tienda siga abierta. <code>!cerrada</code> se lee «no cerrada».</li>
  </ul>
  <p class="aviso">Aquí está la diferencia con el pintor: la condición mira una <b>bandera</b> y no un contador de cuadros pintados.</p>

--

<!-- html -->
  <h3>Línea por línea (2)</h3>
  <ul class="peque">
    <li><code>if (bicis == 0) { return false; }</code><br>Si el cliente sale del <code>while</code> y no hay bicis, solo puede ser porque la tienda ha cerrado. Devuelve <code>false</code>: «no he comprado nada, no vendrán más».</li>
    <li><code>bicis--; vendidas++;</code><br>Si hay bici, se la lleva y se anota la venta.</li>
    <li><code>return true;</code><br>Palabra <code>return</code>: sale del método y entrega <code>true</code> a quien lo llamó: «he comprado una».</li>
    <li><code>public synchronized void cerrar()</code><br>Pone <code>cerrada = true;</code> y llama a <code>notifyAll()</code>, para despertar a los clientes que seguían esperando una bici que ya no llegará.</li>
  </ul>

--

<!-- html -->
  <h3>El cliente no sabe cuántas comprará</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1|2-5|3">
boolean hayBici = true;
while (hayBici) {
    hayBici = estante.vender();
    // aquí, el sleep
}
  </code></pre>
  <ul class="peque">
    <li>El mecánico sabe que monta 4: usa un <code>for</code>. El cliente no sabe cuántas: usa un <code>while</code></li>
    <li><code>vender()</code> decide cuándo se acaba: cuando devuelve <code>false</code>, <code>hayBici</code> vale <code>false</code> y el hilo termina</li>
    <li>También se puede escribir <code>while (estante.vender())</code>: es lo mismo en una sola línea. Es la forma que usa el simulador</li>
  </ul>

--

<!-- html -->
  <h3>El orden al crear los hilos y esperar</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1|2|3|4|5">
// 1. crear y arrancar los mecánicos y los clientes
// 2. join() de cada mecánico
estante.cerrar();
// 3. join() de cada cliente
System.out.println("Total vendidas: " + estante.getVendidas());
  </code></pre>
  <ul class="peque">
    <li><b>Primero</b> se espera a los mecánicos: hasta que no acaben de montar, no se puede cerrar</li>
    <li><b>Después</b> <code>cerrar()</code>: avisa a los clientes que esperan</li>
    <li><b>Luego</b> se espera a los clientes: así el total sale completo</li>
  </ul>

--

<!-- html -->
  <h3>Errores típicos en la tienda de bicis</h3>
  <ul>
    <li>No llamar a <code>cerrar()</code>: los clientes se quedan en <code>wait()</code> y el programa <b>no termina</b></li>
    <li>Llamar a <code>cerrar()</code> <b>antes</b> de esperar a los mecánicos: los clientes se van con el estante vacío y las bicis que quedan por montar no se venden</li>
    <li>No mirar <code>!cerrada</code> en el <code>while</code> de <code>vender()</code>: nadie saca al cliente del <code>wait()</code></li>
    <li>Olvidar el <code>if (bicis == 0)</code> después del <code>while</code>: el cliente vende una bici que no existe y salen <b>bicis negativas</b></li>
    <li>Leer <code>getVendidas()</code> antes del segundo <code>join()</code>: el total sale corto</li>
  </ul>

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
    <li>Prueba <code>notify()</code> en vez de <code>notifyAll()</code> con dos vendedores</li>
    <li>El panel <b>Experimentos</b> propone situaciones para ejecutar: empiezan mirando y acaban contigo escribiendo el almacén y los hilos, poco a poco</li>
  </ul>
  <p class="aviso"><a href="../../simulador/index.html#pintor2&experimentos" target="_blank" rel="noopener">Pintor y dos vendedores</a> (se abre en otra pestaña).</p>

--

<!-- html -->
  <h3>Probarlo en el simulador: la tienda de bicis</h3>
  <ul>
    <li>La <b>tienda de bicis</b> tiene su propio ejemplo: 12 ejercicios de menos a más difíciles</li>
    <li>Desde poner <code>estante.cerrar();</code> hasta escribir <code>Mecanico.run()</code> y <code>Cliente.run()</code></li>
  </ul>
  <p class="aviso"><a href="../../simulador/index.html#bicis&experimentos" target="_blank" rel="noopener">Tienda de bicis</a> (se abre en otra pestaña).</p>

---

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>Quita el <code>wait()</code> del vendedor del ejercicio 1. ¿Qué pasa?</li>
    <li>En el ejercicio 2, ¿se reparten los cuadros por igual?</li>
    <li>¿Qué pasa si el <code>while</code> de <code>vender()</code> no mira <code>numCuadrosPintados</code>?</li>
    <li>Con un pintor y un vendedor, ¿vale <code>notify()</code>? ¿Y con tres hilos?</li>
    <li>¿Qué cambia si en el almacén caben 3 cuadros? ¿Y 10?</li>
    <li>En la tienda de bicis, ¿qué pasa si <code>cerrar()</code> se llama antes de esperar a los mecánicos?</li>
    <li>¿Cuándo usarías contadores (pintor) y cuándo una bandera (bicis) para avisar de que ya no habrá más?</li>
  </ol>
