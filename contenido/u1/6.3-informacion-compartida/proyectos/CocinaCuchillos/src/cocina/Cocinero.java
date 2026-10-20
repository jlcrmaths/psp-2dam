package cocina;

// Un cocinero: coge un cuchillo y lo suelta. Lo repite 4 veces.

import static java.lang.Thread.sleep;

public class Cocinero implements Runnable {

    private Cocina cocina;

    public Cocinero(Cocina cocina) {
        this.cocina = cocina;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 4; i++) {
            cocina.coger();
            try {
                sleep(3000);
            } catch (InterruptedException ex) {
                System.getLogger(Cocinero.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
            }
            cocina.soltar();
        }
    }
}
