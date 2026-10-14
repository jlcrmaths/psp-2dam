package cocina;

// Un cocinero: coge un cuchillo y lo suelta. Lo repite 4 veces.
public class Cocinero implements Runnable {

    private Cocina cocina;

    public Cocinero(Cocina cocina) {
        this.cocina = cocina;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 4; i++) {
            cocina.coger();
            cocina.soltar();
        }
    }
}
