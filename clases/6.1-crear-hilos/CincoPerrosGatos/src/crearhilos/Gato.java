package crearhilos;

public class Gato implements Runnable {

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": Miau!");
    }
}
