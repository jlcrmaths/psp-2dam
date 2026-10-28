package sincronizacion;

import java.util.Random;

// Un jugador: entra si la sala está libre, juega entre 3 y 5 segundos y sale.
public class Jugador implements Runnable {

    private Sala sala;

    public Jugador(Sala sala) {
        this.sala = sala;
    }

    @Override
    public void run() {
        Random azar = new Random();
        sala.empezarPartida();
        try {
            Thread.sleep((3 + azar.nextInt(3)) * 1000);
        } catch (InterruptedException e) {
        }
        sala.terminarPartida();
    }
}
