package comunicarhilos;

// El vendedor vende cuadros hasta que entre todos se han vendido 10. No sabe cuántos venderá él: depende de quién llegue antes.
public class Vendedor implements Runnable {

    private Almacen almacen;

    public Vendedor(Almacen almacen) {
        this.almacen = almacen;
    }

    @Override
    public void run() {
        // Sigue mientras no se hayan vendido los 10 cuadros.
        while (almacen.getCuadrosVendidos() < 10) {
            almacen.vender();
        }
    }
}
