package crearhilos;

public class Principal {

    public static void main(String[] args) {
        Thread h1 = new Thread(new Contador(), "Hilo 1");
        Thread h2 = new Thread(new Contador(), "Hilo 2");
        Thread h3 = new Thread(new Contador(), "Hilo 3");

        h1.start();
        h2.start();
        h3.start();
    }
}
