package interbloqueo;

// Un trabajo necesita los dos ficheros a la vez. Antes de cogerlos, coge el candado único.
public class Trabajo implements Runnable {

    private Fichero primero;
    private Fichero segundo;
    private Object candado;

    public Trabajo(Fichero primero, Fichero segundo, Object candado) {
        this.primero = primero;
        this.segundo = segundo;
        this.candado = candado;
    }

    @Override
    public void run() {
        String nombre = Thread.currentThread().getName();
        // Un solo cerrojo para los dos ficheros: quien lo tiene, tiene los dos.
        synchronized (candado) {
            System.out.println(nombre + " tiene " + primero.getNombre());
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
            }
            System.out.println(nombre + " pide " + segundo.getNombre());
            System.out.println(nombre + " tiene " + primero.getNombre() + " y " + segundo.getNombre() + ": trabaja");
        }
        System.out.println(nombre + " termina");
    }
}
