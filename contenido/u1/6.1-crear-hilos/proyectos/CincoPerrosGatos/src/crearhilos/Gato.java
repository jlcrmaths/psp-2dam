package crearhilos;

public class Gato implements Runnable {

    @Override
    public void run() {
        // Ahora hay cinco gatos y cinco perros: mostrar el nombre del hilo permite saber cuál de ellos habla.
        System.out.println(Thread.currentThread().getName() + ": Miau!");
    }
}
