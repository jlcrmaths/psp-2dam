package jardines;

// Esta clase es el jardín que comparten todos los hilos. Cuenta cuántas personas hay dentro.
public class RecursoJardin {

    private int cuenta;

    public RecursoJardin() {
        cuenta = 100;
    }

    public synchronized void incrementaCuenta() {
        // Muestra qué hilo entra. Thread.currentThread().getName() es el nombre del hilo que ejecuta esto.
        System.out.println("hilo " + Thread.currentThread().getName() + " ----- Entra en Jardín");
        cuenta++;
        System.out.println(cuenta + " en jardín");
    }

    public synchronized void decrementaCuenta() {
        System.out.println("hilo " + Thread.currentThread().getName() + " ----- Sale de Jardín");
        cuenta--;
        System.out.println(cuenta + " en jardín");
    }
}
