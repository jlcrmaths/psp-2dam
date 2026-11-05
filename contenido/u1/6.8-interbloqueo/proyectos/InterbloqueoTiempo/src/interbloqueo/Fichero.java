package interbloqueo;

import java.util.concurrent.locks.ReentrantLock;

// Un fichero con nombre y con su propio cerrojo, que se puede pedir con tiempo máximo.
public class Fichero {

    private String nombre;
    // ReentrantLock: un cerrojo que se coge con lock() o tryLock() y se suelta con unlock().
    private ReentrantLock cerrojo = new ReentrantLock();

    public Fichero(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }

    public ReentrantLock getCerrojo() {
        return cerrojo;
    }
}
