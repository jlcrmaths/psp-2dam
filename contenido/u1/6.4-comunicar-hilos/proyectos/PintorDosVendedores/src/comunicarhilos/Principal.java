package comunicarhilos;

public class Principal {

    public static void main(String[] args) {
        // Un almacén y tres hilos que lo comparten.
        Almacen almacen = new Almacen();

        Thread pintor = new Thread(new Pintor(almacen), "Pintor");
        Thread v1 = new Thread(new Vendedor(almacen), "Vendedor 1");
        Thread v2 = new Thread(new Vendedor(almacen), "Vendedor 2");

        pintor.start();
        v1.start();
        v2.start();
    }
}
