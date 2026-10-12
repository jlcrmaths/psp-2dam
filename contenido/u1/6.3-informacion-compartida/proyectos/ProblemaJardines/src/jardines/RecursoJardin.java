package jardines;

// Esta clase es el jardín que comparten todos los hilos. Cuenta cuántas personas hay dentro.
public class RecursoJardin {

    private int cuenta;

    public RecursoJardin() {
        cuenta = 100;
    }

    public int getCuenta() {
        return cuenta;
    }

    public void incrementaCuenta() {
        // Sumar 1 parece una sola operación, pero son tres: leer el valor, calcular y guardarlo.
        // Con el sleep, otro hilo tiene tiempo de leer el mismo valor antes de que este lo guarde.
        // Eso es una condición de carrera: el resultado depende de qué hilo llega antes.
        int temp = cuenta;
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }
        cuenta = temp + 1;
    }

    public void decrementaCuenta() {
        int temp = cuenta;
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }
        cuenta = temp - 1;
    }
}
