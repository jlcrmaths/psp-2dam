package sincronizacion;

// La lavandería: unas lavadoras que comparten todos los clientes.
public class Lavanderia {

    // final: el valor se fija al crear el objeto y no cambia.
    public final int LAVADORAS = 4;
    private final int PRECIO = 3;
    private int lavadorasDisponibles = LAVADORAS;
    private int clientesAtendidos = 0;
    private int dineroGanado = 0;

    // El cliente solo cuenta como atendido (y paga) cuando consigue lavadora, no mientras espera.
    public synchronized void ponerLavadora() throws InterruptedException {
        while (lavadorasDisponibles == 0) {
            System.out.println(Thread.currentThread().getName() + " esperando. No hay lavadoras disponibles.");
            wait();
        }
        lavadorasDisponibles--;
        // +=: suma a la variable lo que hay a la derecha. dineroGanado += PRECIO es lo mismo que dineroGanado = dineroGanado + PRECIO.
        dineroGanado += PRECIO;
        clientesAtendidos++;
        System.out.println(Thread.currentThread().getName() + " pone una lavadora. Lavadoras disponibles: " + lavadorasDisponibles);
    }

    public synchronized void quitarLavadora() {
        lavadorasDisponibles++;
        System.out.println(Thread.currentThread().getName() + " terminó de lavar. Lavadoras disponibles: " + lavadorasDisponibles);
        // Todos los que esperan esperan lo mismo (una lavadora libre): despertar a uno basta.
        notify();
    }

    // \n es un salto de línea y \t un tabulador, dentro de un texto.
    public synchronized void mostrarInfo() {
        System.out.println("Estado de la lavandería:\n\tClientes totales: " + clientesAtendidos
                + "\n\tDinero ganado: " + dineroGanado + "€"
                + "\n\tLavadoras disponibles: " + lavadorasDisponibles
                + "\n\tLavadoras alquiladas: " + (LAVADORAS - lavadorasDisponibles));
    }
}
