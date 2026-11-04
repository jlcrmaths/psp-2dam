package streamer3;

// La sala de stream. Ahora los espectadores esperan con sleep() fuera de los bloques synchronized.
public class Sala {

    private int numEspectadores = 0;
    private boolean salaCerrada = false;
    private boolean enDirecto = false;
    private String jugadorEnDirecto = "";
    // Objeto que se usa como cerradura: los hilos sincronizan sobre él en vez de sobre la sala entera.
    private final Object lock = new Object();

    public boolean EntraJugador(int tiempo) throws InterruptedException {
        // synchronized (lock) { ... } bloquea solo esas líneas, no el método entero.
        synchronized (lock) {
            while (enDirecto || numEspectadores > 0) {
                System.out.println(Thread.currentThread().getName() + ": No puedo entrar a la sala, me toca esperar.");
                lock.wait();
            }
            if (!salaCerrada) {
                System.out.println(Thread.currentThread().getName() + ": Jugando durante " + (tiempo / 1000) + " segundos");
                enDirecto = true;
                jugadorEnDirecto = Thread.currentThread().getName();
            }
            return enDirecto;
        }
    }

    public void SaleJugador() {
        synchronized (lock) {
            jugadorEnDirecto = "";
            enDirecto = false;
            System.out.println("Soy " + Thread.currentThread().getName() + " abandono la sala");
            lock.notifyAll();
        }
    }

    // Entrar, quedarse y salir en un solo método. El tiempo dentro se espera con sleep(), fuera de synchronized.
    public void EntraSaleEspectador(int tiempo) throws InterruptedException {
        synchronized (lock) {
            while (!enDirecto && !salaCerrada) {
                System.out.println(Thread.currentThread().getName() + ": Sala vacía, espero a que se conecte un jugador.");
                lock.wait(15000);
            }
            // Si la sala se cerró y no hay partida, no entra.
            if (!enDirecto) {
                return;
            }
            numEspectadores++;
            System.out.println("Soy " + Thread.currentThread().getName() + " entro durante " + (tiempo / 1000) + " seg, actualizo estado sala: " + getInfoSala());
        }

        Thread.sleep(tiempo);

        synchronized (lock) {
            numEspectadores--;
            if (numEspectadores == 0) {
                lock.notifyAll();
            }
            System.out.println("Soy " + Thread.currentThread().getName() + " salgo, actualizo estado sala: " + getInfoSala());
        }

        Thread.sleep(tiempo);
    }

    public boolean getSalaCerrada() {
        synchronized (lock) {
            return salaCerrada;
        }
    }

    public void cerrarSala() {
        synchronized (lock) {
            salaCerrada = true;
            System.out.println("Sala cerrada. Vayan saliendo de forma ordenada.");
            lock.notifyAll();
        }
    }

    // Devuelve un texto con el estado de la sala.
    public String getInfoSala() {
        return "\n\t Jugador: "
                + (jugadorEnDirecto.isEmpty() ? " Nadie en directo." : jugadorEnDirecto)
                + "\n\t Espectadores: " + numEspectadores + "\n";
    }
}
