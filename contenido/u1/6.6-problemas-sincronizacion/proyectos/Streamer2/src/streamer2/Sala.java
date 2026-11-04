package streamer2;

// La sala de stream: la comparten los jugadores y los espectadores. Ahora se puede cerrar.
public class Sala {

    private int numEspectadores = 0;
    private boolean salaCerrada = false;
    private boolean enDirecto = false;
    private String jugadorEnDirecto = "";

    // Devuelve true si el jugador ha entrado y false si la sala se cerró mientras esperaba.
    public synchronized boolean EntraJugador(int tiempo) throws InterruptedException {
        while (enDirecto || numEspectadores > 0) {
            System.out.println(Thread.currentThread().getName() + ": No puedo entrar a la sala, me toca esperar.");
            wait();
        }
        if (!salaCerrada) {
            System.out.println(Thread.currentThread().getName() + ": Jugando durante " + (tiempo / 1000) + " segundos");
            enDirecto = true;
            jugadorEnDirecto = Thread.currentThread().getName();
        }
        return enDirecto;
    }

    public synchronized void SaleJugador() {
        jugadorEnDirecto = "";
        enDirecto = false;
        System.out.println("Soy " + Thread.currentThread().getName() + " abandono la sala");
        notifyAll();
    }

    public synchronized void EntraEspectador(int tiempo) throws InterruptedException {
        while (!enDirecto) {
            System.out.println(Thread.currentThread().getName() + ": Sala vacía, espero a que se conecte un jugador.");
            wait(15000);
        }
        numEspectadores++;
        System.out.println("Soy " + Thread.currentThread().getName() + " entro durante " + (tiempo / 1000) + " seg, actualizo estado sala: " + getInfoSala());
        wait(tiempo);
    }

    public synchronized void SaleEspectador() throws InterruptedException {
        numEspectadores--;
        if (numEspectadores == 0) {
            notifyAll();
        }
        System.out.println("Soy " + Thread.currentThread().getName() + " salgo, actualizo estado sala: " + getInfoSala());
    }

    public synchronized boolean getSalaCerrada() {
        return salaCerrada;
    }

    public synchronized void cerrarSala() {
        salaCerrada = true;
        System.out.println("Sala cerrada. Vayan saliendo de forma ordenada.");
        // Despierta a los jugadores que esperaban en la cola: al ver la sala cerrada, se van.
        notifyAll();
    }

    // Devuelve un texto con el estado de la sala.
    public String getInfoSala() {
        return "\n\t Jugador: "
                + (jugadorEnDirecto.isEmpty() ? " Nadie en directo." : jugadorEnDirecto)
                + "\n\t Espectadores: " + numEspectadores + "\n";
    }
}
