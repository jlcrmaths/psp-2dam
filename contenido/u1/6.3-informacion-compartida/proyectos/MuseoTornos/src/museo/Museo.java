package museo;

// El museo es el recurso compartido: los cuatro tornos suman accesos a la misma cuenta.
public class Museo {

    private int cuenta;

    public Museo() {
        cuenta = 0;
    }

    // synchronized: solo un torno a la vez puede sumar. Así la cuenta nunca se pierde.
    public synchronized void accede() {
        cuenta++;
        System.out.println(Thread.currentThread().getName() + " accede. Accesos: " + cuenta);
    }
}
