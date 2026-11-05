package interbloqueo;

// Un trabajo necesita los dos ficheros. Siempre pide primero el que tiene el número más bajo.
public class Trabajo implements Runnable {

    private Fichero primero;
    private Fichero segundo;

    public Trabajo(Fichero uno, Fichero otro) {
        // Da igual en qué orden lleguen: se guarda primero el de número más bajo.
        if (uno.getNumero() < otro.getNumero()) {
            primero = uno;
            segundo = otro;
        } else {
            primero = otro;
            segundo = uno;
        }
    }

    @Override
    public void run() {
        String nombre = Thread.currentThread().getName();
        synchronized (primero) {
            System.out.println(nombre + " tiene " + primero.getNombre());
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
            }
            System.out.println(nombre + " pide " + segundo.getNombre());
            synchronized (segundo) {
                System.out.println(nombre + " tiene " + primero.getNombre() + " y " + segundo.getNombre() + ": trabaja");
            }
        }
        System.out.println(nombre + " termina");
    }
}
