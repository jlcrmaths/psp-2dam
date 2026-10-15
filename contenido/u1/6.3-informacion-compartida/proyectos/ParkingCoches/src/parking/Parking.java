package parking;

// El parking es el recurso compartido: guarda cuántas plazas quedan libres.
public class Parking {

    private int libres;

    public Parking(int plazas) {
        libres = plazas;
    }

    public synchronized void entrar() {
        while (libres == 0) {
            try {
                wait();
            } catch (InterruptedException ex) {
                System.getLogger(Parking.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
            }
        }
        libres--;
        System.out.println(Thread.currentThread().getName() + " entra. Plazas libres: " + libres);
    }

    public synchronized void salir() {
        libres++;
        System.out.println(Thread.currentThread().getName() + " sale. Plazas libres: " + libres);
        notifyAll();
    }
}
