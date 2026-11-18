<!-- html -->
  <h2>Tuberías entre procesos</h2>
  <p>PSP · 2º DAM · Apartado 5.4</p>

---

<!-- html -->
  <h3>Objetivo de la clase</h3>
  <ul>
    <li>Entender qué es una <b>tubería</b> (pipe) entre dos programas</li>
    <li>Escribir un programa que <b>escribe</b> y otro que <b>lee</b> lo que el primero escribe</li>
    <li>Conectarlos desde la terminal con el símbolo <code>|</code></li>
    <li>Usar <code>BufferedReader</code> sobre <code>System.in</code> para leer lo que llega</li>
  </ul>

---

<!-- html -->
  <h3>¿Qué es una tubería?</h3>
  <p>Hasta ahora, cada programa vivía solo. Pero a veces un programa necesita los <b>datos que produce otro</b>.</p>
  <p class="fragment">Una <b>tubería</b> conecta la <b>salida</b> de un programa con la <b>entrada</b> de otro. Lo que el primero escribe, el segundo lo lee.</p>
  <p class="fragment caja">Como una cadena de montaje: el primero fabrica la pieza y se la pasa al siguiente. Mientras el segundo trabaja, el primero ya fabrica la siguiente.</p>

--

<!-- html -->
  <h3>Dos programas, dos procesos</h3>
  <div class="salida">Programa1 &nbsp;&nbsp;<b>|</b>&nbsp;&nbsp; Programa2<br>(escribe con println) &nbsp;→&nbsp; (lee con System.in)</div>
  <ul class="peque">
    <li>Cada programa es un <b>proceso</b> distinto, con su propia <code>main</code> y su propia memoria</li>
    <li>No comparten variables ni objetos: solo comparten un <b>chorro de texto</b></li>
    <li>El símbolo <code>|</code> lo pone el <b>sistema operativo</b>, no Java</li>
  </ul>

--

<!-- html -->
  <h3>Salida y entrada: los dos extremos</h3>
  <ul>
    <li><code>System.out.println(...)</code>: escribe en la <b>salida</b>. Normalmente es la pantalla.</li>
    <li><code>System.in</code>: es la <b>entrada</b>. Normalmente es el teclado.</li>
  </ul>
  <p class="fragment caja">Con una tubería, la salida del primero ya no va a la pantalla: va a la entrada del segundo. <b>El segundo programa no nota la diferencia</b>: lee de <code>System.in</code> igual que si hubiera un teclado.</p>

---

<!-- html -->
  <h3>Ejemplo: el programa que escribe</h3>
  <p class="peque">Proyecto <b>Saludos</b>, clase <b>Programa1</b>: pregunta cuántos nombres quieres y los escribe, uno por línea.</p>
  {{codigo: Saludos/Programa1.java @@ 1|6|7|8-9|10-13|14-16}}

--

<!-- html -->
  <h3>Programa1, línea por línea</h3>
  <ul class="peque">
    <li><code>String[] n = {...}</code><br>Una lista con siete nombres.</li>
    <li><code>Scanner sc = new Scanner(System.in)</code><br>La clase <code>Scanner</code> lee del teclado (<code>System.in</code>).</li>
    <li><code>System.out.println("Dime cuántos...")</code><br>Pregunta cuántos nombres. <b>Ojo:</b> también es salida.</li>
    <li><code>int num = sc.nextInt()</code><br>El método <code>nextInt()</code> de la clase <code>Scanner</code> lee el número que escribas.</li>
    <li><code>while (num &lt;= 0)</code><br>Si el número no vale, vuelve a preguntar.</li>
    <li><code>for (int i = 0; i &lt; num; i++)</code><br>Repite <code>num</code> veces.</li>
    <li><code>n[i % 7]</code><br>El resto (<code>%</code>) de dividir entre 7 da 0, 1, ..., 6 y vuelve a 0. Así nunca se pasa de la lista.</li>
  </ul>

--

<!-- html -->
  <h3>Ejemplo: el programa que lee</h3>
  <p class="peque">Proyecto <b>Saludos</b>, clase <b>Programa2</b>: lee nombres de su entrada y saluda a cada uno.</p>
  {{codigo: Saludos/Programa2.java @@ 7|8|9|10|11}}

--

<!-- html -->
  <h3>Programa2, línea por línea</h3>
  <ul class="peque">
    <li><code>throws IOException</code><br>Leer puede fallar. Con esto el <code>main</code> avisa de ello y no hace falta <code>try</code>/<code>catch</code>.</li>
    <li><code>new InputStreamReader(System.in)</code><br>La clase <code>InputStreamReader</code> convierte lo que llega por la entrada en letras.</li>
    <li><code>new BufferedReader(...)</code><br>La clase <code>BufferedReader</code> (ya la conoces de los ficheros) permite leer <b>línea a línea</b>.</li>
    <li><code>String linea;</code><br>Aquí se guardará cada línea que llegue.</li>
    <li><code>while ((linea = entrada.readLine()) != null)</code><br>Hace tres cosas: lee una línea con el método <code>readLine()</code> de la clase <code>BufferedReader</code>, la guarda en <code>linea</code> y comprueba si es <code>null</code>. <code>null</code> significa que el otro programa ya terminó.</li>
    <li><code>"Hola " + linea</code><br>Escribe el saludo.</li>
  </ul>

--

<!-- html -->
  <h3>Probamos la tubería</h3>
  <div class="salida">java -cp Saludos.jar tuberias.Programa1 <b>|</b> java -cp Saludos.jar tuberias.Programa2</div>
  <p>Escribimos <code>3</code> cuando pregunte. Sale:</p>
  <div class="salida">Vamos a saludar ('Fin' para terminar)<br>Hola Dime cuántos nombres te muestro:<br>Hola Fran<br>Hola Antonio<br>Hola Pepe</div>
  <p class="fragment caja">¿Por qué sale <b>«Hola Dime cuántos...»</b>? Porque la pregunta de <code>Programa1</code> también es salida, y por tanto también viaja por la tubería. <b>Todo lo que un programa escribe lo recibe el siguiente.</b></p>

---

<!-- html -->
  <h3>Cómo se ejecuta (en Windows)</h3>
  <ol class="peque">
    <li>En NetBeans, <b>Limpiar y generar</b> el proyecto (<b>Mayús + F11</b>). Crea un <code>.jar</code> en su carpeta <code>dist</code>.</li>
    <li>Abre la carpeta <code>dist</code> en el Explorador. Haz clic en la barra de direcciones, escribe <code>cmd</code> y pulsa <b>Intro</b>: se abre la terminal ahí.</li>
    <li>Escribe: <code>java -cp Proyecto.jar tuberias.Programa1 | java -cp Proyecto.jar tuberias.Programa2</code></li>
  </ol>
  <p class="fragment caja">Un proyecto tiene <b>dos clases con <code>main</code></b>. Con <code>-cp</code> (classpath) le dices a Java en qué <code>.jar</code> está y con <code>tuberias.Programa1</code> qué clase arrancar. Son dos procesos: dos <code>java</code>.</p>

--

<!-- html -->
  <h3>Un matiz: ¿quién espera a quién?</h3>
  <ul>
    <li>Los dos programas arrancan <b>a la vez</b>.</li>
    <li>Si el segundo lee y el primero todavía no ha escrito nada, <code>readLine()</code> <b>espera</b>.</li>
    <li>Cuando el primero termina, <code>readLine()</code> devuelve <code>null</code> y el segundo sabe que ya no llega nada más.</li>
  </ul>
  <p class="fragment caja">Es el mismo problema de la unidad: dos procesos que trabajan juntos y uno depende del otro. La tubería ya incluye la espera.</p>

---

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de hoy</h3>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p><b>Tubería (pipe)</b>: conecta la salida de un programa con la entrada de otro. Se escribe <code>|</code> en la terminal.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Concepto</span><p><b>Proceso</b>: un programa en marcha. Cada programa de la tubería es un proceso con su propia memoria.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Objeto</span><p><code>System.in</code>: la entrada del programa. Es el teclado, o la salida del programa anterior si hay tubería.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>InputStreamReader</code>: convierte lo que llega por <code>System.in</code> en letras. Se envuelve con un <code>BufferedReader</code>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Palabra</span><p><code>throws IOException</code> en el <code>main</code>: avisa de que leer puede fallar, sin necesidad de <code>try</code>/<code>catch</code>.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Patrón</span><p><code>while ((linea = entrada.readLine()) != null)</code>: lee, guarda y comprueba en una sola condición.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>parseInt()</code> de la clase <code>Integer</code>: convierte un texto como <code>"27"</code> en el número 27.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>StringBuilder</code>: un texto que se puede modificar. Su método <code>reverse()</code> le da la vuelta.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Operador</span><p><code>%</code>: el resto de una división. <code>n % 2 == 0</code> significa que <code>n</code> es par.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Operador</span><p><code>? :</code> (ternario): un <code>if</code>/<code>else</code> en una línea: <code>condición ? si es verdadera : si es falsa</code>.</p></div>
    </div>

---

<!-- html -->
    <h3>Ejercicio 1: sumar los pares</h3>
    <p class="caja"><b>La tarea:</b> un proyecto con dos programas conectados por una tubería.</p>
    <ul>
      <li><b>Programa1</b> genera 25 números aleatorios entre 0 y 100 y los muestra</li>
      <li><b>Programa2</b> recibe esos números y suma solo los <b>pares</b></li>
    </ul>
    <div class="salida">Suma de los pares: 708</div>
    <p class="peque">Proyecto <b>SumaPares</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Qué sabe el primero del segundo? <span class="fragment">Nada. Solo muestra números con <code>println</code>.</span></li>
      <li>¿De dónde lee el segundo? <span class="fragment">De <code>System.in</code>, como si fuera el teclado.</span></li>
      <li>¿Cuándo termina de leer? <span class="fragment">Cuando <code>readLine()</code> devuelve <code>null</code>.</span></li>
      <li>¿Cómo sé si es par? <span class="fragment">El resto de dividir entre 2 es 0.</span></li>
    </ul>

--

<!-- html -->
    <h3>Programa1: el que escribe</h3>
    {{codigo: SumaPares/Programa1.java @@ 1|4-6|5}}
    <ul class="peque">
      <li><code>Math.random() * 101</code>: el método <code>random()</code> de la clase <code>Math</code> da un decimal de 0 a 1; por 101 y con <code>(int)</code> sale un entero de 0 a 100.</li>
      <li>25 <code>println</code>: 25 líneas que viajan por la tubería.</li>
    </ul>

--

<!-- html -->
    <h3>Programa2: el que lee</h3>
    {{codigo: SumaPares/Programa2.java @@ 7|8|9-10|11|12|13-15|17}}

--

<!-- html -->
    <h3>Programa2, línea por línea</h3>
    <ul class="peque">
      <li><code>int suma = 0;</code><br>Aquí se va acumulando la suma.</li>
      <li><code>while ((linea = entrada.readLine()) != null)</code><br>Lee una línea, la guarda y repite mientras lleguen líneas.</li>
      <li><code>Integer.parseInt(linea)</code><br>El método <code>parseInt()</code> de la clase <code>Integer</code> convierte el texto en número.</li>
      <li><code>if (n % 2 == 0)</code><br>Si es par, se suma.</li>
      <li>Fuera del <code>while</code>: muestra la suma.</li>
    </ul>

--

<!-- html -->
    <h3>Ejecutarlo</h3>
    <div class="salida">java -cp SumaPares.jar tuberias.Programa1 <b>|</b> java -cp SumaPares.jar tuberias.Programa2</div>
    <p>Para comprobarlo, mira solo la salida del primero:</p>
    <div class="salida">java -cp SumaPares.jar tuberias.Programa1</div>
    <p class="peque">Suma a mano los pares que salgan y compara con la suma del segundo.</p>

---

<!-- html -->
    <h3>Ejercicio 2: invertir y contar</h3>
    <p class="caja"><b>La tarea:</b> dos programas conectados.</p>
    <ul>
      <li><b>Programa1</b> recibe una línea de texto y la muestra <b>al revés</b></li>
      <li><b>Programa2</b> cuenta los caracteres de la línea invertida y muestra el número</li>
    </ul>
    <div class="salida">Hola mundo<br>→ odnum aloH<br>→ Caracteres: 10</div>
    <p class="peque">Proyecto <b>InvertirYContar</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿De dónde lee el primero? <span class="fragment">Del teclado: lo escribes tú. La tubería empieza en su salida.</span></li>
      <li>¿Cómo se le da la vuelta a un texto? <span class="fragment"><code>String</code> no puede, pero <code>StringBuilder</code> sí: <code>reverse()</code>.</span></li>
      <li>¿Y contar? <span class="fragment">El método <code>length()</code> de la clase <code>String</code>.</span></li>
      <li>¿Hace falta <code>while</code> en el segundo? <span class="fragment">No: llega una sola línea.</span></li>
    </ul>

--

<!-- html -->
    <h3>Programa1: invertir</h3>
    {{codigo: InvertirYContar/Programa1.java @@ 6|7|8|9}}
    <ul class="peque">
      <li><code>nextLine()</code> de <code>Scanner</code>: lee una línea entera, con espacios.</li>
      <li><code>new StringBuilder(t)</code>: copia el texto en uno modificable. <code>reverse()</code>: le da la vuelta. <code>toString()</code>: vuelve a ser <code>String</code>.</li>
    </ul>

--

<!-- html -->
    <h3>Programa2: contar</h3>
    {{codigo: InvertirYContar/Programa2.java @@ 8|9|10}}
    <ul class="peque">
      <li>Lee <b>una</b> línea de la entrada.</li>
      <li><code>linea.length()</code>: el método <code>length()</code> de la clase <code>String</code> da el número de caracteres. El espacio cuenta.</li>
    </ul>

--

<!-- html -->
    <h3>Ejecutarlo</h3>
    <div class="salida">java -cp InvertirYContar.jar tuberias.Programa1 <b>|</b> java -cp InvertirYContar.jar tuberias.Programa2</div>
    <p>La terminal se queda esperando: escribe <code>Hola mundo</code> y pulsa Intro.</p>
    <p class="peque">Para ver la línea invertida, ejecuta solo la primera parte.</p>

---

<!-- html -->
    <h3>Ejercicio 3: par o impar</h3>
    <p class="caja"><b>La tarea:</b> dos programas conectados.</p>
    <ul>
      <li><b>Programa1</b> genera 25 números aleatorios entre 0 y 100 (el mismo del ejercicio 1)</li>
      <li><b>Programa2</b> los muestra indicando si cada uno es par o impar</li>
    </ul>
    <div class="salida">27 - impar<br>13 - impar<br>72 - par<br>…</div>
    <p class="peque">Proyecto <b>ParImpar</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Hay que tocar <code>Programa1</code>? <span class="fragment">No: se copia del ejercicio 1.</span></li>
      <li>¿En qué se parece al ejercicio 1? <span class="fragment">Lee igual. Cambia lo que hace con cada número.</span></li>
      <li>¿Qué hace falta? <span class="fragment">Una decisión con dos caminos: <code>if</code>/<code>else</code>, o el operador ternario.</span></li>
    </ul>

--

<!-- html -->
    <h3>Programa2</h3>
    {{codigo: ParImpar/Programa2.java @@ 9-10|11}}
    <ul class="peque">
      <li><code>condición ? A : B</code>: si la condición es verdadera, vale <code>A</code>; si no, <code>B</code>. Es un <code>if</code>/<code>else</code> dentro del <code>println</code>.</li>
      <li>Aquí: si el resto de dividir entre 2 es 0, escribe <code>linea + " - par"</code>; si no, <code>linea + " - impar"</code>.</li>
    </ul>

--

<!-- html -->
    <h3>Ejecutarlo</h3>
    <div class="salida">java -cp ParImpar.jar tuberias.Programa1 <b>|</b> java -cp ParImpar.jar tuberias.Programa2</div>
    <p class="fragment caja">Fíjate: <code>Programa1</code> es el mismo en tres ejercicios. Solo cambia <code>Programa2</code>.</p>

---

<!-- html -->
    <h3>Ejercicio 4: promedio de los mayores que 50</h3>
    <p class="caja"><b>La tarea:</b> dos programas conectados.</p>
    <ul>
      <li><b>Programa1</b> genera 25 números aleatorios entre 0 y 100 (el mismo)</li>
      <li><b>Programa2</b> calcula el promedio de los que son <b>mayores que 50</b> y lo muestra</li>
    </ul>
    <div class="salida">Promedio de los mayores que 50: 78.72727272727273</div>
    <p class="peque">Proyecto <b>PromedioMayores50</b></p>

--

<!-- html -->
    <h3>Cómo pensarlo</h3>
    <ul>
      <li>¿Cuántas cuentas hay que llevar? <span class="fragment">Dos: la <b>suma</b> y <b>cuántos</b> números han entrado.</span></li>
      <li>¿Y si no entra ninguno? <span class="fragment">Dividir entre 0 no tiene sentido: hay que avisar.</span></li>
      <li>¿Y los decimales? <span class="fragment">Dividir dos <code>int</code> corta los decimales. Hay que convertir uno a <code>double</code>.</span></li>
    </ul>

--

<!-- html -->
    <h3>Programa2</h3>
    {{codigo: PromedioMayores50/Programa2.java @@ 10-11|14-17|19-21|22-23}}
    <ul class="peque">
      <li><code>(double) suma / cuantos</code>: el <code>(double)</code> convierte la suma en decimal <b>antes</b> de dividir. Con 157 / 2 sale 78.5, no 78.</li>
    </ul>

---

<!-- html -->
    <h3>Parte 2: lanzar el programa desde Java</h3>
    <p>Hasta ahora conectábamos los programas <b>a mano</b>, con <code>|</code> en la terminal.</p>
    <p class="fragment">¿Y si un programa Java quiere lanzar a otro y leer lo que escribe, <b>sin terminal</b>?</p>
    <p class="fragment caja">Java puede crear un proceso nuevo y quedarse con el extremo de la tubería: lo que el proceso escribe llega a nuestro programa.</p>
    <p class="peque">Proyecto <b>LanzarProceso</b>: <code>Programa1</code> (el de los 25 números) y <code>Principal</code> (el que lo lanza).</p>

--

<!-- html -->
    <h3>Principal: lanzar y leer</h3>
    {{codigo: LanzarProceso/Principal.java @@ 8|9|10|11-14}}

--

<!-- html -->
    <h3>Principal, línea por línea</h3>
    <ul class="peque">
      <li><code>new ProcessBuilder("java", "-cp", ..., "tuberias.Programa1")</code><br>La clase <code>ProcessBuilder</code> prepara un comando, igual que lo escribirías en la terminal. Cada trozo del comando es un texto aparte.</li>
      <li><code>System.getProperty("java.class.path")</code><br>Da dónde están las clases de este programa, para no escribir rutas a mano.</li>
      <li><code>Process programa1 = pb.start();</code><br>El método <code>start()</code> de la clase <code>ProcessBuilder</code> ejecuta el comando: nace un <b>proceso nuevo</b> y devuelve un objeto <code>Process</code> para controlarlo.</li>
      <li><code>programa1.getInputStream()</code><br>El método <code>getInputStream()</code> de la clase <code>Process</code> da lo que el proceso escribe con <code>println</code>. Es el extremo de la tubería.</li>
      <li><code>new BufferedReader(new InputStreamReader(...))</code><br>Lo mismo de antes, pero en vez de <code>System.in</code> lee de la salida del proceso.</li>
      <li><code>while ((linea = br.readLine()) != null)</code><br>Lee hasta que <code>Programa1</code> termina.</li>
    </ul>

--

<!-- html -->
    <h3>Dos formas de hacer lo mismo</h3>
    <ul>
      <li><b>Terminal:</b> <code>java ... Programa1 | java ... Programa2</code>. La conexión la hace el sistema operativo.</li>
      <li><b>Desde Java:</b> <code>ProcessBuilder</code> + <code>getInputStream()</code>. La conexión la hace <b>nuestro programa</b>.</li>
    </ul>
    <p class="fragment caja">En las dos, <code>Programa1</code> es el mismo: solo hace <code>println</code>. No sabe quién lo lee.</p>
    <p class="fragment peque">Se puede ejecutar desde NetBeans con el botón verde: ya no hace falta la terminal.</p>

--

<!-- html -->
    <div class="nuevo">
    <h3>Lo nuevo de la parte 2</h3>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>ProcessBuilder</code>: prepara un comando. Su método <code>start()</code> lo ejecuta como proceso nuevo.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Clase</span><p><code>Process</code>: el proceso en marcha, visto desde el programa que lo lanzó.</p></div>
    <div class="nuevo-item"><span class="etiqueta">Método</span><p><code>getInputStream()</code> de la clase <code>Process</code>: lo que el proceso escribe. Se lee con <code>BufferedReader</code>.</p></div>
    </div>

---

<!-- html -->
    <h3>Para cerrar</h3>
    <ul>
      <li>Una <b>tubería</b> conecta la salida de un proceso con la entrada de otro.</li>
      <li>El que <b>escribe</b> usa <code>println</code>; el que <b>lee</b> usa <code>BufferedReader</code> sobre <code>System.in</code>.</li>
      <li>El símbolo <code>|</code> lo pone la terminal, no Java.</li>
      <li><code>readLine()</code> devuelve <code>null</code> cuando ya no llega nada.</li>
    </ul>
    <p class="fragment caja"><b>Pregunta:</b> si el primer programa muestra un mensaje de bienvenida, ¿qué le pasa al segundo programa? ¿Cómo lo evitarías?</p>
