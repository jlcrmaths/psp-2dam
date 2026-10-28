package sincronizacion;

// La sala de stream. Dentro solo puede haber un jugador con una partida; los espectadores solo entran si hay partida.
public class Sala {

    // true mientras hay una partida en marcha.
    private boolean jugando = false;
    // Número de la partida actual. Sirve para que un espectador sepa si "su" partida ha acabado.
    private int partida = 0;
    private int espectadores = 0;
    // true cuando ya no habrá más partidas: los espectadores que sigan esperando se van.
    private boolean cerrada = false;

    public synchronized void empezarPartida() {
        String nombre = Thread.currentThread().getName();
        if (jugando) {
            System.out.println(nombre + " espera en la cola: la sala está ocupada");
        }
        while (jugando) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        jugando = true;
        partida++;
        System.out.println(nombre + " empieza la partida " + partida);
        // Avisa a los espectadores que esperaban a que empezara una partida.
        notifyAll();
    }

    public synchronized void terminarPartida() {
        jugando = false;
        System.out.println(Thread.currentThread().getName() + " termina la partida " + partida + " y sale de la sala");
        // Despierta a los espectadores (para que salgan) y a los jugadores en cola (para que uno entre).
        notifyAll();
    }

    // Devuelve el número de la partida que va a ver, o 0 si la sala se cierra sin que haya empezado ninguna.
    public synchronized int entrarEspectador() {
        String nombre = Thread.currentThread().getName();
        if (!jugando && !cerrada) {
            System.out.println(nombre + " espera a que empiece una partida");
        }
        while (!jugando && !cerrada) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        if (!jugando) {
            return 0;
        }
        espectadores++;
        System.out.println(nombre + " entra a ver la partida " + partida + " (espectadores: " + espectadores + ")");
        return partida;
    }

    // El espectador se queda hasta que acabe SU partida. Aunque ya haya empezado otra, no se queda a verla.
    public synchronized void ver(int numeroPartida) {
        while (jugando && partida == numeroPartida) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        espectadores--;
        System.out.println(Thread.currentThread().getName() + " sale de la sala (espectadores: " + espectadores + ")");
    }

    public synchronized void cerrar() {
        cerrada = true;
        notifyAll();
    }
}
