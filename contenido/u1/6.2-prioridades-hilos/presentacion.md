<!-- html -->
  <h2>Prioridades de los hilos</h2>
  <p>PSP · 2º DAM · Apartado 6.2</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Saber qué es la prioridad de un hilo</li>
    <li>Cambiarla con <code>setPriority()</code> y leerla con <code>getPriority()</code></li>
    <li>Conocer <code>Thread.yield()</code></li>
    <li>Comprobar que la prioridad <b>no garantiza</b> el orden</li>
  </ul>

---

<!-- html -->
    <h3>¿Qué es la prioridad?</h3>
    <p>Cada hilo tiene un número del <b>1 al 10</b>: su prioridad.</p>
    <p class="fragment">Con muchos hilos y pocos núcleos, el <b>planificador</b> decide quién se ejecuta. La prioridad es un <b>consejo</b> para esa decisión: más número, más ganas de que le toque.</p>

--

<!-- html -->
    <h3>Tres valores ya preparados</h3>
    <ul>
      <li><code>Thread.MIN_PRIORITY</code>: vale <b>1</b></li>
      <li><code>Thread.NORM_PRIORITY</code>: vale <b>5</b> (la normal)</li>
      <li><code>Thread.MAX_PRIORITY</code>: vale <b>10</b></li>
    </ul>
    <p class="fragment caja">Un hilo nuevo hereda la prioridad del hilo que lo crea. Como <code>main</code> tiene 5, los hilos nacen con 5.</p>

--

<!-- html -->
    <h3>Dos métodos</h3>
    <pre><code class="language-java" data-trim>
h1.setPriority(Thread.MAX_PRIORITY);
int p = h1.getPriority();
    </code></pre>
    <ul class="peque">
      <li><code>setPriority(...)</code>: cambia la prioridad. Se llama <b>antes</b> de <code>start()</code></li>
      <li><code>getPriority()</code>: devuelve el número</li>
    </ul>

--

<!-- html -->
    <h3>Thread.yield()</h3>
    <p><code>Thread.yield()</code> dice al planificador: "si quieres, deja pasar a otro hilo".</p>
    <p class="fragment aviso">Es solo una <b>sugerencia</b>. Java puede ignorarla.</p>

---

<!-- html -->
    <h3>Ejercicio 1: quince hilos</h3>
    <p>Quince hilos hacen la misma tarea pesada. Cinco con prioridad mínima, cinco normal, cinco máxima.</p>
    <p>Al terminar, cada hilo muestra su nombre y su prioridad.</p>
    <div class="salida">Hilos en marcha, espera...<br>Máximo 3 (prioridad 10) termina<br>Normal 1 (prioridad 5) termina<br>…</div>
    <p class="peque">Proyecto <b>PrioridadesHilos</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Cuántas clases con <code>run()</code>? <span class="fragment">Una: <code>Tarea</code>. Los quince hilos hacen lo mismo.</span></li>
      <li>¿Dónde se pone la prioridad? <span class="fragment">No en la tarea: en cada <code>Thread</code>, con <code>setPriority()</code>.</span></li>
      <li>¿Cómo guardo quince hilos? <span class="fragment">Tres arrays de cinco, como en 6.1.</span></li>
    </ul>

--

<!-- html -->
    <h3>La clase Tarea</h3>
    {{codigo: PrioridadesHilos/Tarea.java @@ 1|3-4|5|6-9|10}}

--

<!-- html -->
    <h3>Tarea, línea por línea</h3>
    <ul class="peque">
      <li><code>public class Tarea implements Runnable</code><br>Una tarea que puede ejecutarse en un hilo.</li>
      <li><code>String cadena = "";</code><br>Una cadena vacía.</li>
      <li><code>for (int i = 0; i &lt; 20000; i++)</code><br>20000 vueltas.</li>
      <li><code>cadena += "A";</code><br>Añade una "A". Es lento a propósito: copiar la cadena cada vez hace la tarea pesada.</li>
      <li><code>Thread.yield();</code><br>Sugiere que otro hilo pase. Se repite en cada vuelta.</li>
      <li><code>getPriority()</code><br>Al final, el hilo dice su nombre y su prioridad.</li>
    </ul>

--

<!-- html -->
    <h3>Principal: crear los hilos</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1-3|5-8|9-10">
Thread[] minimos = new Thread[5];
Thread[] normales = new Thread[5];
Thread[] maximos = new Thread[5];

for (int i = 0; i &lt; 5; i++) {
    minimos[i] = new Thread(new Tarea(), "Mínimo " + (i + 1));
    normales[i] = new Thread(new Tarea(), "Normal " + (i + 1));
    maximos[i] = new Thread(new Tarea(), "Máximo " + (i + 1));
    minimos[i].setPriority(Thread.MIN_PRIORITY);
    maximos[i].setPriority(Thread.MAX_PRIORITY);
}
    </code></pre>

--

<!-- html -->
    <h3>Principal: línea por línea</h3>
    <ul class="peque">
      <li>Tres arrays de cinco <code>Thread</code>, uno por prioridad.</li>
      <li>El <code>for</code> da cinco vueltas. En cada una crea tres hilos con la <b>misma</b> clase <code>Tarea</code> y nombres distintos.</li>
      <li><code>"Mínimo " + (i + 1)</code>: el paréntesis hace que sume 1 antes de unir el texto (Mínimo 1, no Mínimo 01).</li>
      <li>Los mínimos y los máximos cambian su prioridad. Los normales no: ya tienen 5.</li>
    </ul>

--

<!-- html -->
    <h3>Principal: arrancar</h3>
    <pre><code class="language-java" data-trim>
System.out.println("Hilos en marcha, espera...");

for (int i = 0; i &lt; 5; i++) {
    minimos[i].start();
    normales[i].start();
    maximos[i].start();
}
    </code></pre>
    <p class="peque">Se arrancan intercalados, para que ninguna prioridad salga con ventaja por empezar antes.</p>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Hilos en marcha, espera...<br>Mínimo 5 (prioridad 1) termina<br>Máximo 1 (prioridad 10) termina<br>Normal 5 (prioridad 5) termina<br>…</div>
    <p class="aviso">Los hilos de prioridad 10 <b>no siempre</b> terminan los primeros. A veces ni siquiera terminan antes que los de prioridad 1.</p>

--

<!-- html -->
    <h3>¿Por qué?</h3>
    <ul>
      <li>Java no gestiona las prioridades: se las <b>pasa al sistema operativo</b>.</li>
      <li>Cada sistema las trata a su manera, y algunos casi las ignoran.</li>
      <li>Con varios núcleos, todos los hilos avanzan a la vez y la prioridad pesa poco.</li>
    </ul>
    <p class="fragment caja">Para obligar a un orden no uses prioridades: usa <code>join()</code> o <code>wait()</code>/<code>notify()</code>.</p>

---

<!-- html -->
  <h3>Resumen</h3>
  <ul>
    <li>La prioridad de un hilo es un número del 1 al 10</li>
    <li><code>MIN_PRIORITY</code> = 1, <code>NORM_PRIORITY</code> = 5, <code>MAX_PRIORITY</code> = 10</li>
    <li><code>setPriority()</code> la cambia (antes de <code>start()</code>); <code>getPriority()</code> la lee</li>
    <li>Un hilo hereda la prioridad del hilo que lo crea</li>
    <li><code>Thread.yield()</code> es solo una sugerencia</li>
    <li>La prioridad <b>no garantiza</b> el orden: no se usa para sincronizar</li>
  </ul>
