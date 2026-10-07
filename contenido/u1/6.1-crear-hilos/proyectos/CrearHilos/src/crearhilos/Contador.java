package crearhilos;

// Runnable es un "contrato": las clases que lo implementan pueden ejecutarse dentro de un hilo.
// El contrato obliga a escribir un método llamado run().
public class Contador implements Runnable {

    // run() contiene lo que hace el hilo. Java lo llama solo, cuando se hace start() sobre el hilo.
    // @Override avisa a Java de que este método cumple el contrato de Runnable.
    // Si lo escribes mal (por ejemplo Run), Java da un error en lugar de ignorarlo.
    @Override
    public void run() {
        // for repite un bloque de código. Aquí i empieza en 1, sube de uno en uno
        // y el bloque se repite mientras se cumpla i <= 10.
        for (int i = 1; i <= 10; i++) {
            // currentThread() es "el hilo que está ejecutando esto ahora mismo" y getName() devuelve su nombre.
            // Así la misma clase sirve para varios hilos: cada uno escribe su propio nombre.
            System.out.println(Thread.currentThread().getName() + ": " + i);
        }
    }
}
