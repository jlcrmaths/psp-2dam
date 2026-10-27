package interbloqueo;

public class Principal {

    // throws InterruptedException: main deja pasar el error de sleep() en vez de escribir un try/catch.
    public static void main(String[] args) throws InterruptedException {
        FicheroA a = new FicheroA();
        FicheroB b = new FicheroB();

        Thread h1 = new Thread(new Hilo1(a, b), "Hilo 1");
        Thread h2 = new Thread(new Hilo2(a, b), "Hilo 2");
        h1.start();
        h2.start();

        // Después de 3 segundos, main mira en qué estado están los hilos.
        // getState() da el estado de un hilo. BLOCKED: está esperando el cerrojo de un objeto.
        Thread.sleep(3000);
        System.out.println(h1.getName() + ": " + h1.getState());
        System.out.println(h2.getName() + ": " + h2.getState());
    }
}
