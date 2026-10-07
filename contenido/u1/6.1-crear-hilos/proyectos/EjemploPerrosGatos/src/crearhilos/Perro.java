package crearhilos;

// Otro Runnable, igual que Gato pero con el sonido del perro.
public class Perro implements Runnable {

    @Override
    public void run() {
        System.out.println("Guau!");
    }
}
