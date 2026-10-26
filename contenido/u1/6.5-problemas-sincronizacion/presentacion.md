<!-- html -->
  <h2>Problemas de sincronización</h2>
  <p>PSP · 2º DAM · Apartado 6.5</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Resolver cinco problemas con hilos que comparten un objeto</li>
    <li>Reconocer el <b>patrón</b> que se repite en todos</li>
    <li>Simular tiempo con el método <code>sleep()</code> de la clase <code>Thread</code> y azar con la clase <code>Random</code></li>
    <li>Esperar a que terminen varios hilos con el método <code>join()</code> de la clase <code>Thread</code></li>
    <li>Leer del teclado con <code>Scanner</code> y escribir en un fichero</li>
  </ul>

--

<!-- html -->
  <h3>El patrón de los cinco ejercicios</h3>
  <ol>
    <li class="fragment">Hay <b>un objeto compartido</b> (fichero, cinta, lavandería…)</li>
    <li class="fragment">Sus métodos son <code>synchronized</code></li>
    <li class="fragment">Si el hilo no puede continuar: <code>while (no puedo) wait();</code></li>
    <li class="fragment">Cuando cambia el estado: <code>notifyAll();</code></li>
    <li class="fragment">Los hilos solo <b>duermen</b>, <b>llaman al objeto</b> y repiten</li>
  </ol>
  <p class="fragment caja">Entiende uno y entiendes los cinco.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>sleep(ms)</code> de la clase <code>Thread</code>: duerme el hilo esos milisegundos (2000 = 2 segundos). Simula que algo tarda.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>Random</code>: <code>nextInt(3)</code> da al azar 0, 1 o 2.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>join()</code> de la clase <code>Thread</code>: «espero aquí hasta que ese hilo termine».</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>Scanner</code>: <code>nextInt()</code> lee un número que escribe el usuario.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>ArrayList</code>: una lista que crece sola. <code>FileWriter</code> y <code>Files</code>: escribir y leer ficheros.</p></div>
    </div>
    <p class="aviso">Regla: <code>sleep</code> va <b>fuera</b> de <code>synchronized</code>. Si un hilo duerme dentro, los demás no pueden ni entrar.</p>

---

<!-- html -->
  <h3>Ejercicio 1: lectores y escritores</h3>
  <ul>
    <li>10 hilos <b>escritores</b>: cada uno escribe su nombre en una línea nueva de un fichero</li>
    <li>10 hilos <b>lectores</b>: cada uno cuenta las líneas que hay en ese momento y lo muestra</li>
  </ul>
  <div class="salida">Escritor 1 ha escrito su nombre<br>Lector 1 lee: el fichero tiene 1 líneas<br>…</div>
  <p class="peque">Proyecto <b>LectoresEscritores</b></p>

--

<!-- html -->
  <h3>¿Qué puede salir mal?</h3>
  <p>Si un lector lee <b>mientras</b> un escritor escribe, puede ver datos a medias. Si dos escritores escriben a la vez, las líneas se mezclan.</p>
  <p class="fragment caja">Solución: el fichero es un objeto compartido y sus métodos son <code>synchronized</code>. Mientras uno trabaja, los demás esperan fuera.</p>
  <p class="fragment peque">Aquí no hace falta <code>wait()</code>: nadie tiene que esperar a que ocurra nada concreto. Solo no pisarse.</p>

--

<!-- html -->
  <h3>Solución: el fichero</h3>
  {{codigo: LectoresEscritores/Fichero.java :: 20-38 @@ 1|3|4|5|14}}

--

<!-- html -->
  <h3>Línea por línea</h3>
  <ul class="peque">
    <li><code>synchronized</code>: un solo hilo a la vez dentro del método. Vale para <b>los dos</b> métodos: un lector tampoco entra si hay un escritor dentro</li>
    <li><code>new FileWriter(ruta, true)</code>: abre el fichero. El <code>true</code> significa «añadir al final»; sin él borraría lo anterior</li>
    <li><code>fw.write(nombre + "\n")</code>: el método <code>write()</code> de la clase <code>FileWriter</code> escribe el nombre y un salto de línea</li>
    <li><code>fw.close()</code>: el método <code>close()</code> de la clase <code>FileWriter</code> cierra el fichero y guarda lo escrito</li>
    <li><code>Files.readAllLines(...)</code>: el método <code>readAllLines()</code> de la clase <code>Files</code> lee todo el fichero y devuelve una lista con una entrada por línea; <code>size()</code> dice cuántas</li>
    <li><code>try / catch (IOException e)</code>: Java obliga a prever que un fichero puede fallar</li>
  </ul>

--

<!-- html -->
  <h3>Crear los 20 hilos</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1|3|4-5|6-7">
Fichero fichero = new Fichero("escritores.txt");

for (int i = 1; i &lt;= 10; i++) {
    Thread escritor = new Thread(new Escritor(fichero), "Escritor " + i);
    Thread lector = new Thread(new Lector(fichero), "Lector " + i);
    escritor.start();
    lector.start();
}
  </code></pre>
  <p class="peque">Un solo <code>Fichero</code>, 20 hilos. Cada vuelta del <code>for</code> lanza un escritor y un lector.</p>

---

<!-- html -->
  <h3>Ejercicio 2: fábrica de piezas</h3>
  <ul class="peque">
    <li>3 máquinas <b>creadoras</b> ponen piezas en una <b>cinta</b> de capacidad 5. Una pieza cada 2–3 s</li>
    <li>1 máquina <b>empaquetadora</b> retira una pieza cada segundo</li>
    <li>Cinta llena: las creadoras esperan. Cinta vacía: la empaquetadora espera</li>
    <li>Se crean <b>50</b> piezas entre todas. Se muestra «Fábrica cerrada»</li>
    <li>Las máquinas <b>no saben</b> cuántas piezas habrá: lo sabe la cinta</li>
  </ul>
  <p class="peque">Proyecto <b>FabricaPiezas</b></p>

--

<!-- html -->
  <h3>Cómo pensarlo</h3>
  <ul>
    <li>Es el pintor y el vendedor otra vez, pero con <b>tres productores</b> <span class="fragment">→ <code>notifyAll()</code></span></li>
    <li>El límite de 50 es de <b>todas las máquinas juntas</b> <span class="fragment">→ el contador está en la <code>CintaTransportadora</code>, no en cada máquina</span></li>
    <li>¿Cómo sabe una máquina que debe parar? <span class="fragment">→ el método de la cinta le <b>devuelve</b> <code>false</code></span></li>
    <li>¿Cómo sabe la empaquetadora que ya no habrá más? <span class="fragment">→ la cinta le avisa con una <b>bandera</b></span></li>
  </ul>

--

<!-- html -->
  <h3>El método de resolución: dos banderas</h3>
  <p>Una <b>bandera</b> es un <code>boolean</code> que dice «sigue» o «para».</p>
  <ul>
    <li><code>seguirFabricando</code>: empieza en <code>true</code>. Pasa a <code>false</code> cuando ya se han creado las 50</li>
    <li><code>seguirEmpaquetando</code>: empieza en <code>true</code>. Pasa a <code>false</code> cuando la cinta está <b>vacía</b> y ya no se fabrica</li>
    <li>Cada método de la cinta <b>devuelve su bandera</b>, y la máquina repite <code>while (cinta.metodo())</code></li>
  </ul>
  <p class="fragment caja">La máquina no cuenta nada: <b>pregunta</b> a la cinta si debe seguir.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de este ejercicio</h3>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>static final</code>: una <b>constante</b> de la clase. Su valor no cambia y se escribe en MAYÚSCULAS (<code>CAPACIDAD</code>).</p></div>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>final</code> en una variable: su valor no se puede cambiar (<code>final int numCreadoras = 3;</code>).</p></div>
    <div class="nuevo-item"><span class="etiqueta">Idea</span><p>Un método <code>synchronized</code> que devuelve <code>boolean</code>: la máquina repite mientras devuelva <code>true</code>. Es la <b>señal de fin</b> de 6.4, pero con banderas.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>throws InterruptedException</code> en un método: deja que el error de <code>wait()</code> lo recoja quien lo llama (aquí, la máquina).</p></div>
    </div>

---

<!-- html -->
  <h3>Solución: los datos de la cinta</h3>
  {{codigo: FabricaPiezas/CintaTransportadora.java :: 1-10 @@ 3-4|6-8|9-10}}
  <ul class="peque">
    <li><code>CAPACIDAD</code> y <code>TOTAL_PIEZAS</code>: dos constantes. Para cambiar la fábrica, solo se cambian aquí</li>
    <li>Tres contadores: las piezas que hay en la cinta, las creadas y las empaquetadas</li>
    <li>Dos <b>banderas</b>, las dos en <code>true</code>: al empezar hay que fabricar y empaquetar</li>
  </ul>

--

<!-- html -->
  <h3>crearPieza(): la puerta de la creadora</h3>
  {{codigo: FabricaPiezas/CintaTransportadora.java :: 12-26 @@ 2-5|6-7|8-11|13|14}}

--

<!-- html -->
  <h3>Línea por línea: crearPieza()</h3>
  <ul class="peque">
    <li><code>while (piezasCinta == CAPACIDAD)</code>: la cinta está llena. La máquina lo dice y se duerme con <code>wait()</code>. Al despertar vuelve a mirar</li>
    <li><code>if (piezasCreadas &gt;= TOTAL_PIEZAS)</code>: ya se crearon todas. <code>seguirFabricando = false;</code> y <b>no se crea nada</b></li>
    <li><code>else { piezasCinta++; piezasCreadas++; … }</code>: una pieza más en la cinta y una más creada</li>
    <li><code>notifyAll();</code>: avisa a todos. La empaquetadora ya puede retirar, o puede que ya no haya que fabricar</li>
    <li><code>return seguirFabricando;</code>: <code>true</code> mientras haya que seguir y <code>false</code> la primera vez que se descubre que ya está todo</li>
  </ul>

--

<!-- html -->
  <h3>empaquetar(): la puerta de la empaquetadora</h3>
  {{codigo: FabricaPiezas/CintaTransportadora.java :: 28-42 @@ 2-5|6-7|8-13|14}}
  <ul class="peque">
    <li><code>while (piezasCinta == 0 &amp;&amp; seguirFabricando)</code>: espera si la cinta está vacía <b>y</b> todavía se están creando piezas</li>
    <li><code>if (piezasCinta == 0 &amp;&amp; !seguirFabricando)</code>: la cinta está vacía y no se crea más. <code>seguirEmpaquetando = false;</code>. <code>!</code> significa «no»</li>
    <li>Si no, hay una pieza: se retira, se cuenta y se avisa con <code>notifyAll()</code></li>
  </ul>

--

<!-- html -->
  <h3>Cómo termina todo: la película del final</h3>
  <ol>
    <li class="fragment">Se crea la pieza 50. <code>piezasCreadas</code> vale 50 y la creadora duerme sus 2–3 s</li>
    <li class="fragment">Al despertar, <b>cada creadora</b> vuelve a llamar a <code>crearPieza()</code>. La primera ve <code>piezasCreadas &gt;= TOTAL_PIEZAS</code> y pone <code>seguirFabricando = false</code></li>
    <li class="fragment">Ese método llama a <code>notifyAll()</code>: despierta a la empaquetadora, si esperaba con la cinta vacía</li>
    <li class="fragment">Las creadoras reciben <code>false</code> y <b>terminan</b></li>
    <li class="fragment">La empaquetadora retira las piezas que queden. Con la cinta vacía y <code>seguirFabricando</code> a <code>false</code>, pone <code>seguirEmpaquetando = false</code> y recibe <code>false</code>: <b>termina</b></li>
    <li class="fragment"><code>main</code> ya puede pasar los <code>join()</code> y mostrar «Fábrica cerrada»</li>
  </ol>

--

<!-- html -->
  <h3>¿Por qué dos banderas y no una?</h3>
  <ul>
    <li>Las creadoras terminan cuando <b>ya no hay que crear</b></li>
    <li>La empaquetadora <b>no puede</b> terminar a la vez: todavía puede haber piezas en la cinta</li>
    <li class="fragment">Por eso la empaquetadora termina cuando la cinta está <b>vacía y</b> ya no se crea más</li>
  </ul>
  <p class="caja">Dos papeles, dos finales: <b>una bandera por papel</b>.</p>

--

<!-- html -->
  <h3>Las máquinas</h3>
  {{codigo: FabricaPiezas/MaquinaCreadora.java :: 12-21 @@ 4|5}}
  <ul class="peque">
    <li><code>while (cinta.crearPieza())</code>: repite mientras la cinta diga <code>true</code>. La máquina <b>no sabe</b> cuántas piezas hay</li>
    <li><code>nextInt(1000) + 2000</code>: el método <code>nextInt()</code> de la clase <code>Random</code> da de 0 a 999. Con 2000 más: <b>2 a 3 segundos</b>. El <code>Random</code> es <code>static final</code>: uno solo para todas</li>
    <li>El <code>sleep</code> está <b>fuera</b> de <code>crearPieza()</code>: si no, nadie más usaría la cinta mientras una máquina duerme</li>
    <li><code>MaquinaEmpaquetadora</code> es igual, con <code>empaquetar()</code> y <code>sleep(1000)</code></li>
  </ul>

--

<!-- html -->
  <h3>Crear y esperar a todos los hilos</h3>
  <pre><code class="language-java" data-trim data-line-numbers="1-2|4-5|7-8|10-12">
final int numCreadoras = 3;
Thread[] maquinasCreadoras = new Thread[numCreadoras];

maquinasCreadoras[i] = new Thread(new MaquinaCreadora(cinta), "Creadora" + i);

for (Thread hilo : maquinasCreadoras) { hilo.start(); }

for (Thread hilo : maquinasCreadoras) { hilo.join(); }

System.out.println("Fábrica cerrada");
  </code></pre>
  <ul class="peque">
    <li>Los hilos se guardan en un <b>array</b> de <code>Thread</code>, y se recorre con un <code>for</code> sencillo (for-each)</li>
    <li>Lo mismo con las empaquetadoras. Cambiar <code>numCreadoras</code> cambia cuántas hay</li>
    <li>El método <code>join()</code> de la clase <code>Thread</code>: «espero a que este hilo termine». Sin los <code>join()</code>, «Fábrica cerrada» saldría <b>al principio</b></li>
    <li><code>main</code> declara <code>throws InterruptedException</code> para no escribir un <code>try/catch</code> en cada <code>join</code></li>
  </ul>

---

<!-- html -->
  <h3>Ejercicio 3: lavandería CleanFast</h3>
  <ul class="peque">
    <li>4 lavadoras. Cada cliente lava de 10 a 20 segundos y paga 3 €</li>
    <li>Sin lavadora libre, el cliente espera. <b>Solo cuenta como atendido cuando consigue una</b></li>
    <li>Menú: 1) llegan clientes, 2) estado, 3) cerrar (espera a que terminen todos)</li>
    <li>Los clientes pueden llegar <b>en varias tandas</b>: los nombres no se repiten</li>
  </ul>
  <p class="peque">Proyecto <b>Lavanderia</b></p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de este ejercicio</h3>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>do { … } while (condición);</code>: repite el bloque y mira la condición <b>al final</b>. Siempre se ejecuta al menos una vez: ideal para un menú.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Interfaz</span><p><code>List&lt;Thread&gt;</code>: «una lista de hilos». <code>ArrayList</code> es la lista concreta que se crea con <code>new</code>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Operador</span><p><code>+=</code>: suma a la variable lo de la derecha. <code>dineroGanado += PRECIO;</code> es <code>dineroGanado = dineroGanado + PRECIO;</code>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>throws Exception</code>: <code>main</code> deja pasar <b>cualquier</b> error, sin <code>try/catch</code>.</p></div>
    </div>

--

<!-- html -->
  <h3>Cómo pensarlo</h3>
  <ul>
    <li>¿Hace falta una clase por lavadora? <span class="fragment">No: solo importa <b>cuántas</b> hay libres.</span></li>
    <li>Es el almacén de un cuadro, pero con <b>4 huecos</b> en vez de 1</li>
    <li>¿Dónde cuento al cliente como atendido y cobro? <span class="fragment">Justo <b>después</b> del <code>while</code>, cuando ya tiene lavadora.</span></li>
    <li>¿Qué hilos esperan a la vez? <span class="fragment">Solo <b>clientes</b>, y todos esperan <b>lo mismo</b>: una lavadora libre.</span></li>
  </ul>

--

<!-- html -->
  <h3>Solución: los datos de la lavandería</h3>
  {{codigo: Lavanderia/Lavanderia.java :: 1-7 @@ 3-4|5|6-7}}
  <ul class="peque">
    <li><code>LAVADORAS</code> y <code>PRECIO</code>: dos constantes <code>final</code>. Para cambiar la lavandería, solo se cambian aquí</li>
    <li><code>lavadorasDisponibles</code> empieza igual que <code>LAVADORAS</code>: todas libres</li>
    <li><code>clientesAtendidos</code> y <code>dineroGanado</code>: dos contadores para el estado</li>
  </ul>

--

<!-- html -->
  <h3>ponerLavadora() y quitarLavadora()</h3>
  {{codigo: Lavanderia/Lavanderia.java :: 9-24 @@ 2-5|6-9|13-15}}
  <ul class="peque">
    <li><code>while (lavadorasDisponibles == 0)</code>: el cliente lo dice y se duerme con <code>wait()</code>. Al despertar, vuelve a mirar</li>
    <li>Al salir del <code>while</code> <b>ya tiene lavadora</b>: resta una, cobra y cuenta al cliente</li>
    <li>Al terminar, <code>quitarLavadora()</code> suma una lavadora y llama a <code>notify()</code></li>
  </ul>

--

<!-- html -->
  <h3>¿<code>notify()</code> o <code>notifyAll()</code>?</h3>
  <p>Aquí vale <code>notify()</code>: todos los que esperan son <b>clientes</b> y esperan <b>lo mismo</b> (una lavadora libre). Despertar a uno cualquiera basta, y ese puede coger la lavadora.</p>
  <p class="fragment caja">Con papeles distintos, como el pintor y los vendedores de 6.4, <code>notify()</code> podría despertar al equivocado. Si dudas, <code>notifyAll()</code> es la opción segura.</p>

--

<!-- html -->
  <h3>El estado: mostrarInfo()</h3>
  {{codigo: Lavanderia/Lavanderia.java :: 26-31 @@ 2|3|4|5}}
  <ul class="peque">
    <li><code>\n</code> es un salto de línea y <code>\t</code> un tabulador, dentro de un texto</li>
    <li>«Alquiladas» = las que están en uso: <code>LAVADORAS - lavadorasDisponibles</code></li>
    <li>También es <code>synchronized</code>: la lectura no se mezcla con un cliente que está cogiendo o dejando una lavadora</li>
  </ul>

--

<!-- html -->
  <h3>El cliente</h3>
  {{codigo: Lavanderia/Cliente.java :: 12-21 @@ 4|5-6|7}}
  <ul class="peque">
    <li><code>ponerLavadora()</code> puede hacer esperar al cliente. Cuando sigue, ya tiene lavadora</li>
    <li><code>10 + random.nextInt(11)</code>: el método <code>nextInt()</code> de la clase <code>Random</code> da de 0 a 10, y con 10 más sale de 10 a 20 segundos</li>
    <li>El <code>sleep</code> está <b>fuera</b> de los métodos de la lavandería: las otras lavadoras siguen trabajando</li>
    <li><code>quitarLavadora()</code>: deja la lavadora libre</li>
  </ul>

--

<!-- html -->
  <h3>El menú: do while y switch</h3>
  {{codigo: Lavanderia/Principal.java :: 18-24 @@ 1|2|4|7}}
  <ul class="peque">
    <li><code>do { … } while (menu != 3)</code>: el menú se repite hasta que se elige cerrar</li>
    <li><code>switch (menu)</code>: elige qué hacer según la opción. Cada <code>case</code> acaba en <code>break</code></li>
    <li>En la opción 1: <code>numClientes = contador + sc.nextInt();</code>. <b>Suma</b> los que llegan a los que ya habían llegado</li>
  </ul>

--

<!-- html -->
  <h3>Los clientes llegan en varias tandas</h3>
  {{codigo: Lavanderia/Principal.java :: 24-29 @@ 1|2|3-4}}
  <ul class="peque">
    <li><code>contador</code>: cuántos clientes han llegado <b>en total</b></li>
    <li>El <code>for</code> empieza en <code>contador</code>, no en 0: así el segundo grupo sigue donde acabó el primero</li>
    <li><code>i++, contador++</code>: las dos suben a la vez. <code>contador</code> da nombre al cliente (<code>Cliente 1</code>, <code>Cliente 2</code>…) y es la <b>posición</b> del hilo en la lista</li>
    <li><code>Hilos.add(...)</code> lo guarda y <code>Hilos.get(contador).start()</code> lo arranca</li>
  </ul>

--

<!-- html -->
  <h3>Cerrar: esperar a todos</h3>
  {{codigo: Lavanderia/Principal.java :: 33-38 @@ 2|3-5}}
  <ul class="peque">
    <li>Se muestra el mensaje y <code>main</code> recorre la lista con un for-each</li>
    <li><code>hilo.join()</code>: «espero a que este cliente termine». Así se espera a los que estaban lavando <b>y</b> a los que esperaban lavadora</li>
    <li>Después, <code>menu</code> vale 3 y el <code>do while</code> acaba: el programa termina</li>
  </ul>
  <p class="caja">El menú solo se muestra <b>una vez</b>, al principio. Si lo quieres ver en cada vuelta, el <code>println</code> iría dentro del <code>do</code>.</p>

---

<!-- html -->
  <h3>Ejercicio 4: panadería self-service</h3>
  <ul class="peque">
    <li>20 barras al abrir. Cada segundo el panadero mira: si quedan menos de 10, hornea 20 (tarda 20 s)</li>
    <li>Cada cliente pide de 1 a 10 barras. Si no hay suficientes, espera</li>
    <li>Primera barra 1 €, las demás 0,75 €</li>
    <li>Menú: 1) grupo de clientes, 2) estado, 3) cerrar</li>
    <li>Al cerrar: el panadero se lleva lo que queda y hornea un último lote</li>
  </ul>
  <p class="peque">Proyecto <b>Panaderia</b></p>

--

<!-- html -->
  <h3>Cómo pensarlo</h3>
  <ul>
    <li>¿Quién comparte qué? <span class="fragment">Panadero y clientes comparten el <code>Mostrador</code>.</span></li>
    <li>Hornear tarda 20 s. ¿Dentro de <code>synchronized</code>? <span class="fragment"><b>No</b>: los clientes no podrían comprar mientras tanto.</span></li>
    <li>¿Cuándo se cierra? <span class="fragment">Cuando <b>todos los clientes</b> han terminado. Algunos aún esperan pan: el panadero tiene que seguir horneando.</span></li>
  </ul>

--

<!-- html -->
  <h3>Solución: el mostrador</h3>
  {{codigo: Panaderia/Mostrador.java :: 3-25 @@ 4|12|20|22}}

--

<!-- html -->
  <h3>Línea por línea</h3>
  <ul class="peque">
    <li><code>double dinero</code>: <code>double</code> es un número con decimales</li>
    <li><code>while (barras &lt; cuantas)</code>: el cliente espera hasta que haya <b>tantas como pide</b>, no solo «alguna»</li>
    <li><code>1 + 0.75 * (cuantas - 1)</code>: la primera barra 1 €, las demás 0,75 €. Con 3 barras: 1 + 0,75 × 2 = 2,50 €</li>
    <li><code>reponer(20)</code>: método de la clase <code>Mostrador</code>. Suma las barras y llama a <code>notifyAll()</code>. Los clientes dormidos vuelven a mirar si ya hay suficientes</li>
  </ul>

--

<!-- html -->
  <h3>El panadero</h3>
  {{codigo: Panaderia/Panadero.java :: 10-32 @@ 2|4-5|8-9|12-16|18-23}}
  <ul class="peque">
    <li><code>dormir()</code> y <code>hornear()</code> son métodos de la propia clase: evitan repetir las mismas líneas</li>
  </ul>

--

<!-- html -->
  <h3>Cerrar la panadería</h3>
  <ol class="peque">
    <li>Salir del menú. No se aceptan más clientes</li>
    <li><code>join()</code> a todos los clientes: los que esperan pan se atienden</li>
    <li><code>mostrador.cerrar()</code>: método de la clase <code>Mostrador</code>. Avisa al panadero</li>
    <li>El panadero sale de su bucle, se lleva lo que queda y hornea el último lote</li>
    <li><code>join()</code> al panadero y resumen final</li>
  </ol>
  <p class="aviso">El orden importa. Si se avisara al panadero <b>antes</b>, vaciaría el mostrador y los clientes que esperan se quedarían colgados.</p>

---

<!-- html -->
  <h3>Ejercicio 5: sala de partida de stream</h3>
  <ul class="peque">
    <li><b>Jugadores:</b> solo uno en la sala. Los demás esperan en cola</li>
    <li><b>Espectadores:</b> entran todos los que quieran, pero <b>solo si hay partida</b>. Si no, esperan</li>
    <li>Cuando la partida acaba, los espectadores salen. Para ver la siguiente deben entrar de nuevo</li>
  </ul>
  <p class="peque">Proyecto <b>SalaStream</b></p>

--

<!-- html -->
  <h3>Dos grupos esperando cosas distintas</h3>
  <ul>
    <li>El <b>jugador</b> espera a que <b>no</b> haya partida</li>
    <li>El <b>espectador</b> espera a que <b>sí</b> haya partida</li>
  </ul>
  <p class="caja">Los dos esperan sobre el mismo objeto, <code>Sala</code>. Por eso <code>notifyAll()</code>: cada uno se despierta, mira su condición y, si no es su momento, se vuelve a dormir.</p>

--

<!-- html -->
  <h3>El truco: el número de partida</h3>
  <p>Un espectador debe irse cuando acaba <b>su</b> partida, aunque otro jugador ya haya empezado la siguiente.</p>
  <p class="fragment">Si solo mirara «¿hay partida?», se quedaría a la siguiente sin darse cuenta.</p>
  <p class="fragment caja">Solución: al entrar, apunta el número de la partida. Se queda mientras <code>jugando &amp;&amp; partida == mi número</code>.</p>

--

<!-- html -->
  <h3>Solución: la sala</h3>
  {{codigo: SalaStream/Sala.java :: 3-23 @@ 1-4|8-9|11-16|17-18|20}}

--

<!-- html -->
  <h3>Los espectadores</h3>
  {{codigo: SalaStream/Sala.java :: 31-59 @@ 6-11|12-14|15-17|21-26|27-28}}
  <ul class="peque">
    <li><code>entrarEspectador()</code> devuelve el número de partida que va a ver (o 0 si ya no habrá más)</li>
    <li><code>ver(n)</code> espera mientras <b>esa</b> partida siga en marcha, y entonces sale</li>
    <li><code>cerrar()</code>, método de la clase <code>Sala</code>, lo llama <code>main</code> al acabar los jugadores: libera a los espectadores que esperaban una partida que ya no llegará</li>
  </ul>

--

<!-- html -->
  <h3>¿Qué sale en pantalla?</h3>
  <div class="salida">Jugador 1 empieza la partida 1<br>Jugador 2 espera en la cola: la sala está ocupada<br>Espectador 6 entra a ver la partida 1 (espectadores: 1)<br>Jugador 1 termina la partida 1 y sale de la sala<br>Jugador 2 empieza la partida 2<br>Espectador 6 sale de la sala (espectadores: 0)<br>…</div>
  <p class="aviso">Cambia en cada ejecución: quién llega primero y quién entra de la cola no está fijado.</p>

---

<!-- html -->
  <h3>Errores típicos</h3>
  <ul>
    <li><code>Thread.sleep()</code> dentro de un método <code>synchronized</code>: nadie más puede avanzar</li>
    <li><code>notify()</code> en vez de <code>notifyAll()</code>: a veces funciona y a veces se cuelga</li>
    <li><code>if</code> en vez de <code>while</code> alrededor de <code>wait()</code></li>
    <li>Un objeto compartido por hilo: ya no se comparte nada</li>
    <li>Olvidar los <code>join()</code>: el mensaje final sale al principio</li>
    <li>Contar el límite en cada hilo en vez de en el objeto compartido</li>
  </ul>

--

<!-- html -->
  <h3>Probarlo en el simulador</h3>
  <p>La fábrica de piezas es un productor y consumidor con <b>varios productores</b> y un tope de piezas entre todos.</p>
  <ul>
    <li>Escribe <code>poner()</code> y <code>retirar()</code> con las piezas del simulador (el simulador usa nombres propios, pero el método es el mismo)</li>
    <li>Quita el <code>if</code> con <code>return false</code>, o cambia <code>notifyAll()</code> por <code>notify()</code>, y mira <b>qué falla</b></li>
    <li>El panel <b>Experimentos</b> te propone situaciones para ejecutar y te dice si lo que has visto es lo esperado</li>
  </ul>
  <p class="aviso"><a href="../../simulador/index.html#fabrica&experimentos" target="_blank" rel="noopener">Abrir el simulador de hilos</a> (se abre en otra pestaña).</p>

---

<!-- html -->
  <h3>Para pensar</h3>
  <ol>
    <li>¿Qué pasa si <code>contarLineas</code> no es <code>synchronized</code>?</li>
    <li>¿Qué pasa si la cinta usa <code>notify()</code> en vez de <code>notifyAll()</code>? ¿Por qué aquí funciona, si hay creadoras y empaquetadora?</li>
    <li>¿Cuándo exactamente se cuenta a un cliente como atendido? ¿Por qué ahí?</li>
    <li>¿Por qué hornea el panadero fuera de <code>synchronized</code>?</li>
    <li>¿Qué pasa si el espectador no apunta el número de partida?</li>
  </ol>
