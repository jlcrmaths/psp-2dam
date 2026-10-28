package sincronizacion;

import java.util.Random;

// Una máquina creadora: crea una pieza cada 2 a 3 segundos y la pone en la cinta.
public class MaquinaCreadora implements Runnable {

    private CintaTransportadora cinta;
    // Random genera números al azar. Es static: una sola para todas las máquinas.
    private static final Random rand = new Random();

    public MaquinaCreadora(CintaTransportadora cinta) {
        this.cinta = cinta;
    }

    @Override
    public void run() {
        try {
            // Repite mientras crearPieza() devuelva true. La máquina no sabe cuántas piezas habrá.
            while (cinta.crearPieza()) {
                // Thread.sleep(ms) duerme el hilo esa cantidad de milisegundos (1000 ms = 1 segundo).
                // nextInt(1000) da de 0 a 999; sumando 2000 sale de 2 a 3 segundos.
                // El sleep va FUERA de los métodos synchronized: así las demás máquinas no se quedan bloqueadas.
                Thread.sleep(rand.nextInt(1000) + 2000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
