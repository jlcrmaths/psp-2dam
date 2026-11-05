package interbloqueo;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Fichero a = new Fichero("A");
        Fichero b = new Fichero("B");

        // Los dos hilos piden los ficheros en el MISMO orden: primero A y después B.
        // Si el hilo 2 recibiera (b, a), volvería el interbloqueo.
        Thread h1 = new Thread(new Trabajo(a, b), "Hilo 1");
        Thread h2 = new Thread(new Trabajo(a, b), "Hilo 2");
        h1.start();
        h2.start();

        Thread.sleep(5000);
        System.out.println(h1.getName() + ": " + h1.getState());
        System.out.println(h2.getName() + ": " + h2.getState());
    }
}
