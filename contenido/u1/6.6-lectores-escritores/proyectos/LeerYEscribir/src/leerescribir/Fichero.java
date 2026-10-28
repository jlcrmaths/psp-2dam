package leerescribir;

// El fichero que comparten todos los hilos. Solo un hilo puede usarlo cada vez: sea lector o escritor.
public class Fichero {

    // Cuántos lectores y cuántos escritores están usando el fichero ahora mismo.
    private int lectores = 0;
    private int escritores = 0;

    // throws InterruptedException avisa de que el método puede lanzar ese error (por wait) y lo deja pasar,
    // en vez de escribir un try/catch dentro. Lo recoge quien llama al método.
    public synchronized void leerFichero() throws InterruptedException {
        // || significa "o": basta con que se cumpla una de las dos condiciones.
        while (lectores > 0 || escritores > 0) {
            System.out.println(Thread.currentThread().getName() + ": Hay alguien usando el fichero. Espero.");
            wait();
        }
        lectores++;
        System.out.println(Thread.currentThread().getName() + ": Leyendo fichero. Lectores: " + lectores);
    }

    public synchronized void escribirFichero() throws InterruptedException {
        while (lectores > 0 || escritores > 0) {
            System.out.println(Thread.currentThread().getName() + ": Hay alguien usando el fichero. Espero.");
            wait();
        }
        escritores++;
        System.out.println(Thread.currentThread().getName() + ": Escribiendo fichero.");
    }

    public synchronized void terminaLeer() {
        lectores--;
        System.out.println(Thread.currentThread().getName() + ": He terminado de leer. Lectores: " + lectores);
        // Hay hilos de los dos tipos esperando: se avisa a todos.
        notifyAll();
    }

    public synchronized void terminaEscribir() {
        escritores--;
        System.out.println(Thread.currentThread().getName() + ": He terminado de escribir");
        notifyAll();
    }
}
