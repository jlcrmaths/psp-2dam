package comunicarhilos;

public class Principal {

    public static void main(String[] args) {
        // Se crea un solo almacén y se le pasa a los dos hilos.
        Almacen almacen = new Almacen();

        Thread pintor = new Thread(new Pintor(almacen), "Pintor");
        Thread vendedor = new Thread(new Vendedor(almacen), "Vendedor");

        pintor.start();
        vendedor.start();
    }
}
