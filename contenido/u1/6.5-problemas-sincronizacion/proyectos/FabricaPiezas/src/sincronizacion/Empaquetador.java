package sincronizacion;

// La máquina empaquetadora: retira una pieza cada 2 segundos. Si no hay ninguna, espera.
public class Empaquetador implements Runnable {

    private Cinta cinta;

    public Empaquetador(Cinta cinta) {
        this.cinta = cinta;
    }

    @Override
    public void run() {
        // Se fabrican 50 piezas en total, así que hay que empaquetar 50.
        for (int i = 1; i <= 50; i++) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
            }
            cinta.retirar();
        }
    }
}
