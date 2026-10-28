package semaforo;

// Un escritor: pide permiso al semáforo, escribe un rato y avisa de que ha terminado.
public class Escritor implements Runnable {

    private Semaforo semaforo;

    public Escritor(Semaforo s) {
        this.semaforo = s;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": Intentando escribir");
        semaforo.accesoEscribir();
        try {
            Thread.sleep((int) (Math.random() * 500));
        } catch (InterruptedException e) {
        }
        semaforo.escrituraFinalizada();
    }
}
