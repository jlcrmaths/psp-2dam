package sincronizacion;

// Cuenta las líneas que tiene el fichero en el momento de leer.
public class Lector implements Runnable {

    private Fichero fichero;

    public Lector(Fichero fichero) {
        this.fichero = fichero;
    }

    @Override
    public void run() {
        fichero.contarLineas(Thread.currentThread().getName());
    }
}
