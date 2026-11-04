package sincronizacion;

// Un cliente pide entre 1 y 10 barras. Si no hay suficientes, espera a que el panadero hornee más.
public class Cliente implements Runnable {

    private final Panaderia panaderia;
    private final int barrasSolicitadas;

    public Cliente(Panaderia panaderia, int barrasSolicitadas) {
        this.panaderia = panaderia;
        this.barrasSolicitadas = barrasSolicitadas;
    }

    @Override
    public void run() {
        try {
            panaderia.atenderCliente(barrasSolicitadas);
        } catch (InterruptedException e) {
        }
    }
}
