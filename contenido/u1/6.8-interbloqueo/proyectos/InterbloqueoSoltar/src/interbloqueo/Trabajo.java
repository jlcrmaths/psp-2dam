package interbloqueo;

// Un trabajo usa los dos ficheros, pero de uno en uno: suelta el primero antes de pedir el segundo.
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
        // Primer bloque: coge el primer fichero, trabaja y lo suelta al cerrar las llaves.
        synchronized (primero) {
            System.out.println(nombre + " tiene " + primero.getNombre() + ": trabaja");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
            }
        }
        // Segundo bloque: ahora ya no retiene el primero cuando pide el segundo.
        System.out.println(nombre + " pide " + segundo.getNombre());
        synchronized (segundo) {
            System.out.println(nombre + " tiene " + segundo.getNombre() + ": trabaja");
        }
        System.out.println(nombre + " termina");
    }
}
