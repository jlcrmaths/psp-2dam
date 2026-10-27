package interbloqueo;

public class Principal {

    public static void main(String[] args) {
        Fichero a = new Fichero("A");
        Fichero b = new Fichero("B");

        // Los dos hilos piden los ficheros en el MISMO orden: primero A y después B.
        // Si el hilo 2 recibiera (b, a), volvería el interbloqueo.
        new Thread(new Trabajo(a, b), "Hilo 1").start();
        new Thread(new Trabajo(a, b), "Hilo 2").start();
    }
}
