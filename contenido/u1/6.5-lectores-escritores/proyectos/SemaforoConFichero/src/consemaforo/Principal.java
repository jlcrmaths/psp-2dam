package consemaforo;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Principal {

    public static void main(String[] args) throws IOException {
        // El semáforo solo controla quién entra. El fichero es un File aparte que se pasa a cada hilo.
        File fichero = new File("Lectores.txt");
        new FileWriter(fichero).close();
        Semaforo smfro = new Semaforo();

        for (int i = 1; i <= 2; i++) {
            new Thread(new Escritor(smfro, fichero), "Escritor" + i).start();
        }
        for (int i = 1; i <= 5; i++) {
            new Thread(new Lector(smfro, fichero), "Lector" + i).start();
        }
    }
}
