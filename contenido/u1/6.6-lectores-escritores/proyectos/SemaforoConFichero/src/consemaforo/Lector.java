package consemaforo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

// Un lector: pide permiso al semáforo, lee el fichero y avisa de que ha terminado.
public class Lector implements Runnable {

    private Semaforo semaforo;
    private File fichero;

    public Lector(Semaforo s, File f) {
        this.semaforo = s;
        this.fichero = f;
    }

    @Override
    public void run() {
        semaforo.accesoLeer();
        try {
            int lineas = 0;
            BufferedReader br = new BufferedReader(new FileReader(fichero));
            while (br.readLine() != null) {
                lineas++;
            }
            br.close();
            System.out.println(Thread.currentThread().getName() + ": He leído " + lineas + " líneas");
            // Este sleep solo sirve para que se vea que varios lectores leen a la vez.
            Thread.sleep(300);
        } catch (IOException ex) {
            System.out.println(ex);
        } catch (InterruptedException ex) {
        }
        semaforo.lecturaFinalizada();
    }
}
