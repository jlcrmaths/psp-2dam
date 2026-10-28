package discoteca;

import java.io.BufferedWriter;
import java.io.IOException;

// Un escritor: pide el fichero, escribe su nombre en una línea nueva y avisa de que termina.
public class Escritor implements Runnable {

    private Discoteca Granada10;

    public Escritor(Discoteca d) {
        this.Granada10 = d;
    }

    @Override
    public void run() {
        try {
            BufferedWriter bw = Granada10.escribir();
            // write() escribe un texto y newLine() añade el salto de línea.
            bw.write(Thread.currentThread().getName());
            bw.newLine();
            // flush() vacía el buffer: manda al fichero lo escrito. Sin flush(), el texto se queda en memoria y no llega al disco.
            bw.flush();
            System.out.println(Thread.currentThread().getName() + " he escrito mi nombre en el fichero");
            Granada10.terminaEscribir();
        } catch (InterruptedException ex) {
        } catch (IOException ex) {
            System.out.println(ex);
        }
    }
}
