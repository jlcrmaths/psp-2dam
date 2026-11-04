package streamer;

// La sala de stream: la comparten los jugadores y los espectadores.
public class Sala {

    private int numEspectadores = 0;
    private boolean enDirecto = false;
    private String jugadorEnDirecto = "";

    // El jugador solo entra si no hay nadie en directo y no queda ningún espectador dentro.
    public synchronized void EntraJugador(int tiempo) throws InterruptedException {
        while (enDirecto || numEspectadores > 0) {
            System.out.println(Thread.currentThread().getName() + ": No puedo entrar a la sala, me toca esperar.");
            wait();
        }
        System.out.println(Thread.currentThread().getName() + ": Jugando durante " + (tiempo / 1000) + " segundos");
        enDirecto = true;
        jugadorEnDirecto = Thread.currentThread().getName();
    }

    public synchronized void SaleJugador() {
        jugadorEnDirecto = "";
        enDirecto = false;
        System.out.println("Soy " + Thread.currentThread().getName() + " abandono la sala");
        // Despierta a los espectadores (para que salgan) y a los jugadores en cola.
        notifyAll();
    }

    public synchronized void EntraEspectador(int tiempo) throws InterruptedException {
        while (!enDirecto) {
            System.out.println(Thread.currentThread().getName() + ": Sala vacía, espero a que se conecte un jugador.");
            // wait(15000) espera como mucho 15 segundos, aunque nadie lo avise.
            wait(15000);
        }
        numEspectadores++;
        System.out.println("Soy " + Thread.currentThread().getName() + " entro durante " + (tiempo / 1000) + " seg, actualizo estado sala: " + getInfoSala());
        // El espectador se queda dentro 'tiempo' ms o hasta que lo avise SaleJugador(). wait() libera la sala mientras tanto.
        wait(tiempo);
    }

    public synchronized void SaleEspectador() throws InterruptedException {
        numEspectadores--;
        // El último espectador que sale avisa: puede entrar un jugador.
        if (numEspectadores == 0) {
            notifyAll();
        }
        System.out.println("Soy " + Thread.currentThread().getName() + " salgo, actualizo estado sala: " + getInfoSala());
    }

    // Devuelve un texto con el estado de la sala.
    public String getInfoSala() {
        return "\n\t Jugador: "
                + (jugadorEnDirecto.isEmpty() ? " Nadie en directo." : jugadorEnDirecto)
                + "\n\t Espectadores: " + numEspectadores + "\n";
    }
}
