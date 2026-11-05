package interbloqueo;

import java.util.Random;
import java.util.concurrent.TimeUnit;

// Un trabajo necesita los dos ficheros. Si el segundo no llega a tiempo, suelta el primero y lo vuelve a intentar.
public class Trabajo implements Runnable {

    private Fichero primero;
    private Fichero segundo;
    private Random r = new Random();

    public Trabajo(Fichero primero, Fichero segundo) {
        this.primero = primero;
        this.segundo = segundo;
    }

    @Override
    public void run() {
        String nombre = Thread.currentThread().getName();
        boolean hecho = false;
        try {
            while (!hecho) {
                // lock() espera hasta tener el cerrojo.
                primero.getCerrojo().lock();
                System.out.println(nombre + " tiene " + primero.getNombre());
                Thread.sleep(1000);
                System.out.println(nombre + " pide " + segundo.getNombre());
                // tryLock(1, TimeUnit.SECONDS): espera como mucho 1 segundo. Devuelve true si lo consigue y false si no.
                if (segundo.getCerrojo().tryLock(1, TimeUnit.SECONDS)) {
                    System.out.println(nombre + " tiene " + primero.getNombre() + " y " + segundo.getNombre() + ": trabaja");
                    // unlock() suelta el cerrojo.
                    segundo.getCerrojo().unlock();
                    primero.getCerrojo().unlock();
                    hecho = true;
                } else {
                    System.out.println(nombre + " no consigue " + segundo.getNombre() + ": suelta " + primero.getNombre() + " y reintenta");
                    primero.getCerrojo().unlock();
                    // Espera un tiempo al azar para que los dos hilos no reintenten justo a la vez.
                    Thread.sleep(r.nextInt(1000));
                }
            }
        } catch (InterruptedException e) {
        }
        System.out.println(nombre + " termina");
    }
}
