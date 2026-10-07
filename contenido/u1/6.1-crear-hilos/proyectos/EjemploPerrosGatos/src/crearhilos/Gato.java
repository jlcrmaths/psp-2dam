package crearhilos;

// Igual que Contador: es un Runnable, así que puede ejecutarse en un hilo.
// Su run() solo escribe el sonido del gato.
public class Gato implements Runnable {

    @Override
    public void run() {
        System.out.println("Miau!");
    }
}
