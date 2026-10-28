package semaforo;

// Un lector: pide permiso al semáforo, lee un rato y avisa de que ha terminado.
public class Lector implements Runnable {

    private Semaforo semaforo;

    public Lector(Semaforo s) {
        this.semaforo = s;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": Intentando leer");
        semaforo.accesoLeer();
        // Math.random() da un número entre 0 y 1. Multiplicado por 500 y pasado a int, da de 0 a 499.
        // El paréntesis importa: (int) (Math.random() * 500). Con (int) (Math.random()) * 500 saldría siempre 0.
        try {
            Thread.sleep((int) (Math.random() * 500));
        } catch (InterruptedException e) {
        }
        semaforo.lecturaFinalizada();
    }
}
