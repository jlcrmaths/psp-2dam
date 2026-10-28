package inanicionresuelta;

// Un lector que lee 6 veces seguidas. Vuelve a pedir paso nada más salir.
public class Lector implements Runnable {

    private Semaforo semaforo;

    public Lector(Semaforo s) {
        this.semaforo = s;
    }

    @Override
    public void run() {
        for (int i = 0; i < 6; i++) {
            semaforo.accesoLeer();
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
            }
            semaforo.lecturaFinalizada();
        }
    }
}
