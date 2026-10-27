package interbloqueo;

// Un trabajo necesita los dos ficheros a la vez: coge primero uno y después el otro.
public class Trabajo implements Runnable {

    private Fichero primero;
    private Fichero segundo;

    public Trabajo(Fichero primero, Fichero segundo) {
        this.primero = primero;
        this.segundo = segundo;
    }

    @Override
    public void run() {
        String nombre = Thread.currentThread().getName();
        // synchronized (objeto) { ... }: coge el cerrojo de ese objeto mientras dura el bloque.
        synchronized (primero) {
            System.out.println(nombre + " tiene " + primero.getNombre());
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
            }
            synchronized (segundo) {
                System.out.println(nombre + " tiene " + primero.getNombre() + " y " + segundo.getNombre() + ": trabaja");
            }
        }
        System.out.println(nombre + " termina");
    }
}
