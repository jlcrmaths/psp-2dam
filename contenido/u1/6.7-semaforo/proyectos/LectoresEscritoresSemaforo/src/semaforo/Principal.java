package semaforo;

public class Principal {

    public static void main(String[] args) {
        Semaforo smfro = new Semaforo();

        for (int i = 1; i <= 5; i++) {
            new Thread(new Lector(smfro), "Lector" + i).start();
        }
        for (int i = 1; i <= 2; i++) {
            new Thread(new Escritor(smfro), "Escritor" + i).start();
        }
    }
}
