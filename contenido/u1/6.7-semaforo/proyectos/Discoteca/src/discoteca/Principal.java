package discoteca;

import java.io.IOException;

public class Principal {

    public static void main(String[] args) throws IOException {
        Discoteca Granada10 = new Discoteca("Discoteca.txt");

        final int numLectores = 5;
        final int numEscritores = 2;

        Thread[] Lectores = new Thread[numLectores];
        Thread[] Escritores = new Thread[numEscritores];

        for (int i = 0; i < numLectores; i++) {
            Lectores[i] = new Thread(new Lector(Granada10), "Lector" + i);
        }
        for (int i = 0; i < numEscritores; i++) {
            Escritores[i] = new Thread(new Escritor(Granada10), "Escritor" + i);
        }

        for (int i = 0; i < numLectores; i++) {
            Lectores[i].start();
        }
        for (Thread escr : Escritores) {
            escr.start();
        }
    }
}
