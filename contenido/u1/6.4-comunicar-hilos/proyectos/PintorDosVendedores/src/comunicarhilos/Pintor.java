package comunicarhilos;

// El pintor pinta 10 cuadros.
public class Pintor implements Runnable {

    private Almacen almacen;

    public Pintor(Almacen almacen) {
        this.almacen = almacen;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            almacen.depositar(i);
        }
    }
}
