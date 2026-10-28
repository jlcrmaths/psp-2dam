package discoteca;

import java.io.BufferedReader;
import java.io.IOException;

// Un lector: pide el fichero, cuenta sus líneas, las muestra y avisa de que termina.
public class Lector implements Runnable {

    private Discoteca Granada10;

    public Lector(Discoteca d) {
        this.Granada10 = d;
    }

    @Override
    public void run() {
        try {
            int lineas = 0;
            BufferedReader br = Granada10.leer();
            // readLine() lee una línea del fichero y devuelve null cuando ya no quedan más.
            while (br.readLine() != null) {
                lineas++;
            }
            // close() cierra el fichero. Siempre hay que cerrarlo cuando se termina de usar.
            br.close();
            System.out.println(Thread.currentThread().getName() + " he leído " + lineas + " líneas en el fichero");
            Granada10.terminaLeer();
        } catch (InterruptedException ex) {
        } catch (IOException ex) {
            System.out.println(ex);
        }
    }
}
