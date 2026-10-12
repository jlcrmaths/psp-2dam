package comunicarhilos;

// El pintor pinta 10 cuadros y, al acabar, avisa al almacén de que ha terminado.
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
        almacen.terminar();
    }
}
