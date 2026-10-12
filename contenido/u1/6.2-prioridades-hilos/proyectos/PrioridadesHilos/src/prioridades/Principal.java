package prioridades;

public class Principal {

    public static void main(String[] args) {
        int n = 5;
        Thread[] minimos = new Thread[n];
        Thread[] normales = new Thread[n];
        Thread[] maximos = new Thread[n];

        for (int i = 0; i < n; i++) {
            minimos[i] = new Thread(new Tarea(), "Mínimo " + (i + 1));
            normales[i] = new Thread(new Tarea(), "Normal " + (i + 1));
            maximos[i] = new Thread(new Tarea(), "Máximo " + (i + 1));
            // setPriority() cambia la prioridad del hilo. Thread.MIN_PRIORITY vale 1 y Thread.MAX_PRIORITY vale 10.
            // Si no se llama a setPriority(), el hilo hereda la del hilo que lo crea (main): Thread.NORM_PRIORITY, que vale 5.
            minimos[i].setPriority(Thread.MIN_PRIORITY);
            maximos[i].setPriority(Thread.MAX_PRIORITY);
        }

        System.out.println("Hilos en marcha, espera...");

        for (int i = 0; i < n; i++) {
            minimos[i].start();
            normales[i].start();
            maximos[i].start();
        }
    }
}
