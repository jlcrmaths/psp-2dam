package consemaforo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

// Un escritor: pide permiso al semáforo, escribe su nombre en el fichero y avisa de que ha terminado.
public class Escritor implements Runnable {

    private Semaforo semaforo;
    private File fichero;

    public Escritor(Semaforo s, File f) {
        this.semaforo = s;
        this.fichero = f;
    }

    @Override
    public void run() {
        semaforo.accesoEscribir();
        try {
            BufferedWriter bw = new BufferedWriter(new FileWriter(fichero, true));
            bw.write(Thread.currentThread().getName());
            bw.newLine();
            bw.close();
            System.out.println(Thread.currentThread().getName() + ": He escrito mi nombre en el fichero");
        } catch (IOException ex) {
            System.out.println(ex);
        }
        semaforo.escrituraFinalizada();
    }
}
