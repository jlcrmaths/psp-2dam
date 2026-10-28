package fichero;

import java.io.BufferedWriter;
import java.io.IOException;

// Un escritor: pide el fichero, escribe su nombre en una línea nueva y avisa de que termina.
public class Escritor implements Runnable {

    private Fichero fich;

    public Escritor(Fichero f) {
        this.fich = f;
    }

    @Override
    public void run() {
        try {
            BufferedWriter bw = fich.escribirFichero();
            // write() escribe un texto y newLine() añade el salto de línea.
            bw.write(Thread.currentThread().getName());
            bw.newLine();
            // close() vacía el buffer (manda lo escrito al disco) y cierra el fichero. Sin él, el texto no llega al fichero.
            bw.close();
            System.out.println(Thread.currentThread().getName() + ": He escrito mi nombre en el fichero");
            fich.terminaEscribir();
        } catch (InterruptedException ex) {
        } catch (IOException ex) {
            System.out.println(ex);
        }
    }
}
