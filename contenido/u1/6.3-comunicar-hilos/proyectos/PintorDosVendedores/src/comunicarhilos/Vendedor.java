package comunicarhilos;

// El vendedor vende cuadros mientras quede alguno. No sabe cuántos venderá él: depende de quién llegue antes.
public class Vendedor implements Runnable {

    private Almacen almacen;

    public Vendedor(Almacen almacen) {
        this.almacen = almacen;
    }

    @Override
    public void run() {
        boolean hayMas = true;
        // Sigue mientras vender() diga true. Cuando dice false, no hay más cuadros y el hilo termina.
        while (hayMas) {
            hayMas = almacen.vender();
        }
    }
}
