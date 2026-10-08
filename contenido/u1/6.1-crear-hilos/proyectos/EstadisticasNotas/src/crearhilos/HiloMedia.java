package crearhilos;

// Funciona como HiloSuma, pero al final divide entre cuántas notas hay.
public class HiloMedia implements Runnable {

    private int[] notas;

    public HiloMedia(int[] notas) {
        this.notas = notas;
    }

    @Override
    public void run() {
        // total es double (número con decimales). Así la división final conserva los decimales: 65 / 10 da 6.5.
        // Con int, 65 / 10 daría 6, porque la división entre enteros descarta los decimales.
        double total = 0;
        for (int i = 0; i < notas.length; i++) {
            total = total + notas[i];
        }
        double media = total / notas.length;
        System.out.println(Thread.currentThread().getName() + ": media = " + media);
    }
}
