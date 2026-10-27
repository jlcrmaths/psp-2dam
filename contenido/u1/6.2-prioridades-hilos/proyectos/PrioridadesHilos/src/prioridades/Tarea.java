package prioridades;

// Esta tarea es pesada a propósito: une 20000 letras en una cadena. Así los hilos tardan lo bastante para competir entre ellos.
public class Tarea implements Runnable {

    @Override
    public void run() {
        String cadena = "";
        for (int i = 0; i < 200000; i++) {
            cadena += "A";
            // yield() sugiere al planificador que deje pasar a otro hilo. Es solo una sugerencia: Java puede ignorarla.
            Thread.yield();
        }
        // getPriority() devuelve la prioridad del hilo actual (un número del 1 al 10).
        System.out.println(Thread.currentThread().getName() + " (prioridad " + Thread.currentThread().getPriority() + ") termina");
    }
}
