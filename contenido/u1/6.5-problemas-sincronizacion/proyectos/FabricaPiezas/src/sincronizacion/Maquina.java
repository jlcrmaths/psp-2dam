package sincronizacion;

import java.util.Random;

// Una máquina automática: fabrica una pieza cada 1 a 3 segundos y la pone en la cinta.
public class Maquina implements Runnable {

    private Cinta cinta;

    public Maquina(Cinta cinta) {
        this.cinta = cinta;
    }

    @Override
    public void run() {
        // Random genera números al azar. nextInt(3) da 0, 1 o 2; sumando 1 sale 1, 2 o 3.
        Random azar = new Random();
        boolean seguir = true;
        while (seguir) {
            // Thread.sleep(ms) duerme el hilo esa cantidad de milisegundos (1000 ms = 1 segundo).
            // Como wait(), obliga a escribir un try/catch con InterruptedException.
            // Se duerme FUERA de synchronized: así las demás máquinas no se quedan bloqueadas.
            try {
                Thread.sleep((1 + azar.nextInt(3)) * 1000);
            } catch (InterruptedException e) {
            }
            seguir = cinta.poner();
        }
    }
}
