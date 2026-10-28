package sincronizacion;

// Un cliente pide entre 1 y 10 barras. Si no hay suficientes, espera a que el panadero hornee más.
public class Cliente implements Runnable {

    private Mostrador mostrador;
    private int barras;

    public Cliente(Mostrador mostrador, int barras) {
        this.mostrador = mostrador;
        this.barras = barras;
    }

    @Override
    public void run() {
        mostrador.comprar(barras);
    }
}
