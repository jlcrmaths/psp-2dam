package interbloqueo;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Fichero a = new Fichero("A");
        Fichero b = new Fichero("B");
        // Object: la clase más simple de Java. Aquí solo sirve como cerrojo que comparten los dos hilos.
        Object candado = new Object();

        // Cada hilo sigue pidiendo en un orden distinto, pero ahora da igual: el candado es el mismo.
        Thread h1 = new Thread(new Trabajo(a, b, candado), "Hilo 1");
        Thread h2 = new Thread(new Trabajo(b, a, candado), "Hilo 2");
        h1.start();
        h2.start();

        Thread.sleep(5000);
        System.out.println(h1.getName() + ": " + h1.getState());
        System.out.println(h2.getName() + ": " + h2.getState());
    }
}
