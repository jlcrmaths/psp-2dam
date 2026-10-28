package leerescribir2;

public class Principal {

    public static void main(String[] args) {
        Fichero f = new Fichero();

        int numLectores = 5;
        int numEscritores = 2;

        Thread[] lectores = new Thread[numLectores];
        Thread[] escritores = new Thread[numEscritores];

        for (int i = 0; i < numLectores; i++) {
            lectores[i] = new Thread(new Lector(f), "Lector" + i);
        }
        for (int i = 0; i < numEscritores; i++) {
            escritores[i] = new Thread(new Escritor(f), "Escritor" + i);
        }

        for (int i = 0; i < numLectores; i++) {
            lectores[i].start();
        }
        for (Thread escr : escritores) {
            escr.start();
        }
    }
}
