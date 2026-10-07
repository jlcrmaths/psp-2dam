package crearhilos;

public class HiloSuma implements Runnable {

    private int[] numeros;

    public HiloSuma(int[] numeros) {
        this.numeros = numeros;
    }

    @Override
    public void run() {
        int total = 0;
        for (int i = 0; i < numeros.length; i++) {
            total = total + numeros[i];
        }
        System.out.println(Thread.currentThread().getName() + ": suma = " + total);
    }
}
