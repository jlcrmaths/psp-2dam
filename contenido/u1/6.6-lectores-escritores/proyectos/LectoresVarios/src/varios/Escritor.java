package varios;

import java.util.Random;

// Un escritor: espera a estar solo, escribe durante un tiempo al azar y termina.
public class Escritor implements Runnable {

    private Fichero fich;

    public Escritor(Fichero f) {
        this.fich = f;
    }

    private Random r = new Random();

    @Override
    public void run() {
        try {
            fich.escribirFichero();
            Thread.sleep((r.nextInt(9) + 2) * 1000);
            fich.terminaEscribir();
        } catch (InterruptedException ex) {
        }
    }
}
