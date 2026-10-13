package cocina;

// Un cocinero: coge un cuchillo, lo usa 3 segundos y lo suelta. Lo repite 4 veces.
public class Cocinero implements Runnable {

    private Cocina cocina;

    public Cocinero(Cocina cocina) {
        this.cocina = cocina;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 4; i++) {
            cocina.coger();
            // Thread.sleep(3000) duerme el hilo 3000 milisegundos: simula que cocina con el cuchillo.
            // Va fuera de synchronized para que los demás cocineros puedan coger sus cuchillos mientras tanto.
            // InterruptedException es el error que Java lanza si despiertan al hilo mientras duerme; sleep obliga a escribir try/catch.
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
            }
            cocina.soltar();
        }
    }
}
