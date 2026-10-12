package jardines;

// Es el mismo jardín del ejercicio anterior, pero con los dos métodos synchronized.
public class RecursoJardin {

    private int cuenta;

    public RecursoJardin() {
        cuenta = 100;
    }

    public int getCuenta() {
        return cuenta;
    }

    // synchronized hace que solo un hilo a la vez pueda estar dentro del método.
    // Los demás esperan fuera. Así nadie se cuela entre leer y guardar.
    public synchronized void incrementaCuenta() {
        int temp = cuenta;
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }
        cuenta = temp + 1;
    }

    public synchronized void decrementaCuenta() {
        int temp = cuenta;
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }
        cuenta = temp - 1;
    }
}
