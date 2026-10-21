package comunicarhilos;

public class Principal {

    public static void main(String[] args) {
        // Se crea un solo almacén, con sitio para 1 cuadro, y se le pasa a los dos hilos.
        Almacen almacen = new Almacen(1);

        Thread pintor = new Thread(new Pintor(almacen), "Pintor");
        Thread vendedor = new Thread(new Vendedor(almacen), "Vendedor");

        pintor.start();
        vendedor.start();
    }
}
