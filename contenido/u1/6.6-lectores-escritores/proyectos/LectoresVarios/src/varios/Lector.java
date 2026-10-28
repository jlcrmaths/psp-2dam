package varios;

import java.util.Random;

// Un lector: espera si hay un escritor, lee durante un tiempo al azar y termina. Igual que antes.
public class Lector implements Runnable {

    private Fichero fich;

    public Lector(Fichero f) {
        this.fich = f;
    }

    private Random r = new Random();

    @Override
    public void run() {
        try {
            fich.leerFichero();
            // El tiempo de lectura va FUERA de los métodos synchronized: así los demás hilos pueden entrar a mirar y esperar.
            // nextInt(9) da de 0 a 8; sumando 2 sale de 2 a 10 segundos.
            Thread.sleep((r.nextInt(9) + 2) * 1000);
            fich.terminaLeer();
        } catch (InterruptedException ex) {
        }
    }
}
