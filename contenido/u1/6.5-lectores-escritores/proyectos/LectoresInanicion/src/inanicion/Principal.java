package inanicion;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Semaforo smfro = new Semaforo();

        // Los lectores arrancan con un pequeño desfase para que siempre haya alguno leyendo.
        for (int i = 1; i <= 4; i++) {
            new Thread(new Lector(smfro), "Lector" + i).start();
            Thread.sleep(50);
        }
        new Thread(new Escritor(smfro), "Escritor").start();
    }
}
