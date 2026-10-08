package crearhilos;

public class Principal {

    public static void main(String[] args) {
        int[] notas = {7, 4, 9, 6, 10, 3, 8, 5, 7, 6};

        // Los tres hilos reciben el mismo array y solo lo leen.
        Thread h1 = new Thread(new HiloMaximo(notas), "Hilo 1");
        Thread h2 = new Thread(new HiloMinimo(notas), "Hilo 2");
        Thread h3 = new Thread(new HiloMedia(notas), "Hilo 3");

        h1.start();
        h2.start();
        h3.start();
    }
}
