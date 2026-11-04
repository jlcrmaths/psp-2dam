package streamer;

import java.util.Random;

// Un espectador: entra a ver partidas, sale, descansa y repite hasta que decide irse.
public class Espectador implements Runnable {

    private final Sala sala;

    public Espectador(Sala sala) {
        this.sala = sala;
    }

    private int generarTiempoAleatorio() {
        Random random = new Random();
        // Genera un número entre 1 y 50 segundos
        return (1 + random.nextInt(50)) * 1000;
    }

    private int generarAleatorio() {
        Random random = new Random();
        // Genera un número entre 1 y 10
        return 1 + random.nextInt(10);
    }

    @Override
    public void run() {
        try {
            // Cada vuelta tiene 1 posibilidad entre 10 de que el espectador se vaya.
            while (generarAleatorio() != 5) {
                sala.EntraEspectador(generarTiempoAleatorio());
                sala.SaleEspectador();
                Thread.sleep(generarTiempoAleatorio());
            }
            System.out.println("Soy el espectador " + Thread.currentThread().getName() + ", me voy");
        } catch (InterruptedException e) {
        }
    }
}
