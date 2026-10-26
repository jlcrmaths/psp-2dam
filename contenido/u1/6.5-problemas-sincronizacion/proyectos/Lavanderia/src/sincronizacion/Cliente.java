package sincronizacion;

import java.util.Random;

// Un cliente: espera una lavadora, lava un rato al azar y se va.
public class Cliente implements Runnable {

    private final Lavanderia cleanFast;
    private static final Random random = new Random();

    public Cliente(Lavanderia cleanFast) {
        this.cleanFast = cleanFast;
    }

    @Override
    public void run() {
        try {
            cleanFast.ponerLavadora();
            // El lavado se hace con la lavadora ya cogida, pero fuera de synchronized:
            // si no, los demás clientes no podrían ni mirar si hay sitio.
            // nextInt(11) da de 0 a 10; sumando 10 sale de 10 a 20 segundos.
            int tiempoUso = 10 + random.nextInt(11);
            Thread.sleep(tiempoUso * 1000);
            cleanFast.quitarLavadora();
        } catch (InterruptedException ex) {
        }
    }
}
