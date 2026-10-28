package leerescribir2;

// El fichero compartido, con otra regla de entrada.
public class Fichero {

    private int lectores = 0;
    private int escritores = 0;

    public synchronized void leerFichero() throws InterruptedException {
        while (escritores > 0) {
            System.out.println(Thread.currentThread().getName() + ": Hay un escritor. Espero.");
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
        if (lectores == 0) {
            notifyAll();
        }
    }

    public synchronized void terminaEscribir() {
        escritores--;
        System.out.println(Thread.currentThread().getName() + ": He terminado de escribir");
        notifyAll();
    }
}
