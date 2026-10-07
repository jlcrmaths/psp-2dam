package crearhilos;

public class Principal {

    public static void main(String[] args) {
        int[] numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

        Thread h1 = new Thread(new HiloSuma(numeros), "Hilo 1");
        Thread h2 = new Thread(new HiloResta(numeros), "Hilo 2");
        Thread h3 = new Thread(new HiloMultiplica(numeros), "Hilo 3");

        h1.start();
        h2.start();
        h3.start();
    }
}
