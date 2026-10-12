<!-- html -->
  <h2>Información compartida entre hilos</h2>
  <p>PSP · 2º DAM · Apartado 6.3</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Ver qué pasa cuando varios hilos usan el <b>mismo objeto</b></li>
    <li>Entender la <b>condición de carrera</b></li>
    <li>Comprobar que un programa puede dar un resultado distinto cada vez</li>
    <li>Saber por qué hace falta sincronizar</li>
  </ul>

---

<!-- html -->
    <h3>Hasta ahora, cada hilo iba a lo suyo</h3>
    <p>En 6.1 y 6.2 cada hilo hacía su trabajo sin tocar lo de los demás.</p>
    <p class="fragment">Ahora varios hilos van a <b>compartir un objeto</b>: todos leen y cambian el mismo dato.</p>

--

<!-- html -->
    <h3>Una idea para recordarlo</h3>
    <p>Una pizarra con un número escrito. Veinte personas lo leen, calculan en su cabeza y lo borran para escribir el nuevo.</p>
    <p class="fragment">Si dos leen el mismo número a la vez, las dos escribirán el mismo resultado. Una de las dos <b>se pierde</b>.</p>

---

<!-- html -->
    <h3>El problema de los jardines</h3>
    <p>Un jardín tiene <b>100 personas</b>. Entran 10 y salen 10, todas a la vez.</p>
    <p class="fragment">Al final debería haber <b>100</b> otra vez.</p>
    <p class="fragment aviso">¿Saldrá siempre 100?</p>

--

<!-- html -->
    <h3>Ejercicio 1: los jardines</h3>
    <p>20 hilos: 10 entran (suman 1) y 10 salen (restan 1). Al acabar todos, <code>main</code> muestra la cuenta.</p>
    <div class="salida">Personas en el jardín: 100</div>
    <p class="peque">Proyecto <b>ProblemaJardines</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Qué comparten los hilos? <span class="fragment">El <b>jardín</b>: un solo objeto <code>RecursoJardin</code>.</span></li>
      <li>¿Cuántas clases de hilo? <span class="fragment">Dos: <code>EntraJardin</code> y <code>SaleJardin</code>.</span></li>
      <li>¿Cómo espera <code>main</code> a los 20? <span class="fragment">Con el método <code>join()</code> de la clase <code>Thread</code> en cada uno.</span></li>
    </ul>

--

<!-- html -->
    <h3>El jardín: RecursoJardin</h3>
    {{codigo: ProblemaJardines/RecursoJardin.java @@ 1|3|5-8|10-12|14-21}}

--

<!-- html -->
    <h3>RecursoJardin, línea por línea</h3>
    <ul class="peque">
      <li><code>private int cuenta;</code><br>El número de personas. Es el dato que comparten los 20 hilos.</li>
      <li><code>cuenta = 100;</code><br>En el constructor, empieza con 100 personas.</li>
      <li><code>getCuenta()</code><br>Método de la clase <code>RecursoJardin</code>. Devuelve la cuenta, para mostrarla al final.</li>
      <li><code>int temp = cuenta;</code><br>Primero <b>lee</b> el valor y lo guarda aparte.</li>
      <li><code>Thread.sleep(100);</code><br>El método <code>sleep()</code> de la clase <code>Thread</code> espera 100 milisegundos. Aquí otros hilos tienen tiempo de leer el <b>mismo</b> valor.</li>
      <li><code>cuenta = temp + 1;</code><br>Por último <b>guarda</b> el resultado.</li>
    </ul>

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
    <h3>Los hilos y Principal</h3>
    <pre><code class="language-java" data-trim data-line-numbers="1-2|4-7|9-11|13-15">
RecursoJardin jardin = new RecursoJardin();
ArrayList&lt;Thread&gt; lista = new ArrayList&lt;&gt;();

for (int i = 1; i &lt;= 10; i++) {
    lista.add(new Thread(new EntraJardin(jardin), "Entra" + i));
    lista.add(new Thread(new SaleJardin(jardin), "Sale" + i));
}

for (Thread t : lista) {
    t.start();
}

for (Thread t : lista) {
    t.join();
}
    </code></pre>

--

<!-- html -->
    <h3>Principal, línea por línea</h3>
    <ul class="peque">
      <li>Se crea <b>un solo</b> jardín. Los 20 hilos reciben ese mismo objeto.</li>
      <li>El primer <code>for</code> crea los hilos y los guarda en la lista con el método <code>add()</code> de la clase <code>ArrayList</code>: uno que entra y otro que sale, diez veces.</li>
      <li>El segundo recorre la lista y arranca cada hilo con el método <code>start()</code> de la clase <code>Thread</code>.</li>
      <li>El tercero llama al método <code>join()</code> de la clase <code>Thread</code> en cada uno: <code>main</code> espera a que acaben los 20 antes de mostrar la cuenta.</li>
    </ul>

--

<!-- html -->
    <h3>¿Qué sale en pantalla?</h3>
    <div class="salida">Personas en el jardín: 101</div>
    <div class="salida">Personas en el jardín: 99</div>
    <p class="aviso">Casi nunca sale 100. Y el valor <b>cambia</b> de una ejecución a otra.</p>

--

<!-- html -->
    <h3>Condición de carrera</h3>
    <p>Cuando varios hilos leen y cambian el mismo dato, y el resultado depende de <b>quién llega antes</b>.</p>
    <p class="fragment">Lo peor: el programa no da error. Da un resultado <b>equivocado</b> y distinto cada vez.</p>
    <p class="fragment caja">La solución: que solo un hilo a la vez pueda estar dentro de <code>incrementaCuenta</code>. Se hace con <code>synchronized</code>, que veremos en el apartado siguiente.</p>

---

<!-- html -->
  <h3>Resumen</h3>
  <ul>
    <li>Los hilos pueden compartir un objeto: todos reciben la misma referencia</li>
    <li>Sumar 1 son tres pasos: leer, calcular y guardar</li>
    <li>Si dos hilos se cuelan entre los pasos, se pierden cambios: <b>condición de carrera</b></li>
    <li>El resultado es incorrecto y cambia en cada ejecución</li>
    <li>El método <code>join()</code> de la clase <code>Thread</code> hace que <code>main</code> espere a todos antes de mostrar el resultado</li>
    <li>Se arregla permitiendo un solo hilo a la vez: <code>synchronized</code></li>
  </ul>
