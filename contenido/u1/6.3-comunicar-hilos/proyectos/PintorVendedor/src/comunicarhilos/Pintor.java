package comunicarhilos;

// El pintor pinta 10 cuadros y los deja en el almacén, de uno en uno.
public class Pintor implements Runnable {

    // Los dos hilos tienen que usar el MISMO almacén, así que entra por el constructor.
    private Almacen almacen;

    public Pintor(Almacen almacen) {
        this.almacen = almacen;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            // Si el almacén está lleno, depositar() hace esperar al pintor.
            almacen.depositar(i);
        }
    }
}
