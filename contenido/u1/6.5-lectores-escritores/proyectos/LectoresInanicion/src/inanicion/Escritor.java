package inanicion;

// Un escritor que escribe una sola vez, cuando ya hay lectores leyendo.
public class Escritor implements Runnable {

    private Semaforo semaforo;

    public Escritor(Semaforo s) {
        this.semaforo = s;
    }

    @Override
    public void run() {
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
        }
        System.out.println(Thread.currentThread().getName() + ": Intentando escribir");
        semaforo.accesoEscribir();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
        }
        semaforo.escrituraFinalizada();
    }
}
