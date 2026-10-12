package comunicarhilos;

// El vendedor vende 10 cuadros, de uno en uno.
public class Vendedor implements Runnable {

    private Almacen almacen;

    public Vendedor(Almacen almacen) {
        this.almacen = almacen;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            // Si no hay cuadro, vender() hace esperar al vendedor.
            almacen.vender(i);
        }
    }
}
