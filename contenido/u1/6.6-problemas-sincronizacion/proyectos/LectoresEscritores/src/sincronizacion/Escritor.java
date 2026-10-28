package sincronizacion;

// Escribe su nombre en el fichero.
public class Escritor implements Runnable {

    private Fichero fichero;

    public Escritor(Fichero fichero) {
        this.fichero = fichero;
    }

    @Override
    public void run() {
        fichero.escribir(Thread.currentThread().getName());
    }
}
