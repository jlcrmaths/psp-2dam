package crearhilos;

public class Perro implements Runnable {

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": Guau!");
    }
}
