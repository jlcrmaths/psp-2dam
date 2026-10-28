package sincronizacion;

// La máquina empaquetadora: retira una pieza de la cinta cada segundo. Si no hay ninguna, espera.
public class MaquinaEmpaquetadora implements Runnable {

    private CintaTransportadora cinta;

    public MaquinaEmpaquetadora(CintaTransportadora cinta) {
        this.cinta = cinta;
    }

    @Override
    public void run() {
        try {
            // Repite mientras empaquetar() devuelva true: no sabe cuántas piezas habrá.
            while (cinta.empaquetar()) {
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
