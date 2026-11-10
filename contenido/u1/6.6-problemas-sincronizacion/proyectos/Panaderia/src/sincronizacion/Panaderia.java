package sincronizacion;

// La panadería: la comparten el panadero y todos los clientes.
public class Panaderia {

    private int barrasDisponibles = 20;
    private int barrasVendidas = 0;
    // Barras horneadas en total, contando las 20 iniciales.
    private int totalBarrasHorneadas = 20;
    // double es un número con decimales. Aquí guarda los euros.
    private double dineroGanado = 0;
    private boolean abierta = true;

    public synchronized void atenderCliente(int barrasSolicitadas) throws InterruptedException {
        while (barrasDisponibles < barrasSolicitadas) {
            System.out.println(Thread.currentThread().getName() + " esperando. No hay suficiente pan.");
            wait();
        }
        // La primera barra cuesta 1€ y cada una de las demás 0,75€.
        double precio = 1.0 + (barrasSolicitadas - 1) * 0.75;
        dineroGanado += precio;
        barrasDisponibles -= barrasSolicitadas;
        barrasVendidas += barrasSolicitadas;
        System.out.println(Thread.currentThread().getName() + " compró " + barrasSolicitadas + " barras por " + precio + "€. Barras restantes: " + barrasDisponibles);
    }

    public synchronized boolean hacenFaltaBarras() {
        return barrasDisponibles < 10;
    }

    // Este método NO es synchronized: durante los 20 segundos de horneado los clientes pueden seguir comprando.
    public void hornear() throws InterruptedException {
        System.out.println("Panadero horneando 20 barras...");
        Thread.sleep(20000);
        reponer(20);
    }

    // Este sí es synchronized: solo coge la panadería un instante para añadir las barras.
    private synchronized void reponer(int barras) {
        barrasDisponibles += barras;
        totalBarrasHorneadas += barras;
        System.out.println("Panadero terminó de hornear. Barras disponibles: " + barrasDisponibles);
        // Los clientes que esperaban pan se despiertan y comprueban si ya hay suficiente.
        notifyAll();
    }

    // Cuando se cierra, el panadero se lleva el pan que queda.
    public synchronized void llevarseBarras() {
        System.out.println("Panadero se lleva " + barrasDisponibles + " barras a su casa");
        barrasDisponibles = 0;
    }

    public synchronized void cerrarPanaderia() {
        abierta = false;
    }

    public synchronized boolean estaAbierta() {
        return abierta;
    }

    public synchronized void mostrarInfo() {
        System.out.println("Barras disponibles: " + barrasDisponibles);
        System.out.println("Barras horneadas: " + totalBarrasHorneadas);
        System.out.println("Dinero recaudado: " + dineroGanado + "€");
    }

    public synchronized void mensajeCierre() {
        System.out.println("--- Resumen final ---");
        System.out.println("Total de barras vendidas: " + barrasVendidas);
        System.out.println("Dinero recaudado: " + dineroGanado + "€");
        System.out.println("Panadero dejó listas las barras para mañana. ¡Hasta luego!");
    }
}
