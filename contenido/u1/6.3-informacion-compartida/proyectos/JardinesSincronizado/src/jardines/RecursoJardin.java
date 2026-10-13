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
