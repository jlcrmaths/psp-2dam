package sincronizacion;

// La lavandería: 4 lavadoras que comparten todos los clientes.
public class Lavanderia {

    private int libres = 4;
    private int atendidos = 0;

    // El cliente solo cuenta como atendido cuando consigue lavadora, no mientras espera.
    public synchronized void entrar() {
        String nombre = Thread.currentThread().getName();
        if (libres == 0) {
            System.out.println(nombre + " espera en la cola");
        }
        while (libres == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        libres--;
        atendidos++;
        System.out.println(nombre + " paga 3€ y empieza a lavar");
    }

    public synchronized void salir() {
        libres++;
        System.out.println(Thread.currentThread().getName() + " termina y deja libre una lavadora");
        // Puede haber varios clientes esperando: se despierta a todos y el que llegue primero la coge.
        notifyAll();
    }

    public synchronized void mostrarEstado() {
        System.out.println("Clientes atendidos: " + atendidos);
        System.out.println("Ganancia total: " + (atendidos * 3) + "€");
        System.out.println("Lavadoras disponibles: " + libres);
        System.out.println("Lavadoras en uso: " + (4 - libres));
    }
}
