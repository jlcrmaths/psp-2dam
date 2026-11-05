package interbloqueo;

public class Principal {

    // throws InterruptedException: main deja pasar el error de sleep() en vez de escribir un try/catch.
    public static void main(String[] args) throws InterruptedException {
        Fichero a = new Fichero("A");
        Fichero b = new Fichero("B");

        // El hilo 1 pide primero A y después B. El hilo 2 hace lo contrario.
        Thread h1 = new Thread(new Trabajo(a, b), "Hilo 1");
        Thread h2 = new Thread(new Trabajo(b, a), "Hilo 2");
        h1.start();
        h2.start();

        // Después de 5 segundos, main mira en qué estado están los hilos.
        // getState() da el estado de un hilo. BLOCKED: está esperando el cerrojo de un objeto.
        Thread.sleep(5000);
        System.out.println(h1.getName() + ": " + h1.getState());
        System.out.println(h2.getName() + ": " + h2.getState());
    }
}
