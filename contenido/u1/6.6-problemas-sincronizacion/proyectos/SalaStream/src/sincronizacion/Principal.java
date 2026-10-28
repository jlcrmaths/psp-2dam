package sincronizacion;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Sala sala = new Sala();
        Thread[] jugadores = new Thread[3];
        Thread[] espectadores = new Thread[8];

        for (int i = 0; i < jugadores.length; i++) {
            jugadores[i] = new Thread(new Jugador(sala), "Jugador " + (i + 1));
            jugadores[i].start();
        }
        for (int i = 0; i < espectadores.length; i++) {
            espectadores[i] = new Thread(new Espectador(sala), "Espectador " + (i + 1));
            espectadores[i].start();
        }

        // Cuando han jugado todos, no habrá más partidas: se cierra la sala y los espectadores que esperan se van.
        for (Thread j : jugadores) {
            j.join();
        }
        sala.cerrar();
        for (Thread e : espectadores) {
            e.join();
        }
        System.out.println("Sala cerrada");
    }
}
