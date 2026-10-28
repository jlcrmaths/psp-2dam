package sincronizacion;

// El mostrador de la panadería: lo comparten el panadero y todos los clientes.
public class Mostrador {

    private int barras = 20;
    // Barras horneadas en total, contando las 20 iniciales.
    private int horneadas = 20;
    private int vendidas = 0;
    // double es un número con decimales. Aquí guarda los euros.
    private double dinero = 0;
    private boolean cerrando = false;

    public synchronized void comprar(int cuantas) {
        String nombre = Thread.currentThread().getName();
        if (barras < cuantas) {
            System.out.println(nombre + " quiere " + cuantas + " barras y espera: hay " + barras);
        }
        while (barras < cuantas) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        barras = barras - cuantas;
        vendidas = vendidas + cuantas;
        // La primera barra cuesta 1€ y cada una de las demás 0,75€.
        double precio = 1 + 0.75 * (cuantas - 1);
        dinero = dinero + precio;
        System.out.println(nombre + " compró " + cuantas + " barras por " + precio + "€. Barras restantes: " + barras);
    }

    public synchronized boolean hacenFalta() {
        return barras < 10;
    }

    public synchronized void reponer(int cuantas) {
        barras = barras + cuantas;
        horneadas = horneadas + cuantas;
        System.out.println("Panadero terminó de hornear. Barras disponibles: " + barras);
        // Los clientes que esperaban pan se despiertan y comprueban si ya hay suficiente.
        notifyAll();
    }

    // Cuando se cierra, el panadero se lleva el pan que queda.
    public synchronized void vaciar() {
        System.out.println("Panadero se lleva " + barras + " barras a su casa");
        barras = 0;
    }

    public synchronized void cerrar() {
        cerrando = true;
    }

    public synchronized boolean estaCerrando() {
        return cerrando;
    }

    public synchronized void mostrarEstado() {
        System.out.println("Barras disponibles: " + barras);
        System.out.println("Barras horneadas: " + horneadas);
        System.out.println("Dinero recaudado: " + dinero + "€");
    }

    public synchronized void mostrarResumen() {
        System.out.println("--- Resumen final ---");
        System.out.println("Total de barras vendidas: " + vendidas);
        System.out.println("Dinero recaudado: " + dinero + "€");
    }
}
