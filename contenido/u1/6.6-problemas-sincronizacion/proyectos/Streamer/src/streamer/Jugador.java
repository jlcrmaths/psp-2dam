package streamer;

import java.util.Random;

// Un jugador: espera a que la sala esté libre, juega un tiempo al azar y sale.
public class Jugador implements Runnable {

    private final Sala sala;

    public Jugador(Sala sala) {
        this.sala = sala;
    }

    private int generarTiempoAleatorio() {
        Random random = new Random();
        // Genera un número entre 1 y 60 segundos
        return (1 + random.nextInt(60)) * 1000;
    }

    @Override
    public void run() {
        try {
            int tiempo = generarTiempoAleatorio();
            sala.EntraJugador(tiempo);
            Thread.sleep(tiempo);
            sala.SaleJugador();
        } catch (InterruptedException e) {
        }
    }
}
