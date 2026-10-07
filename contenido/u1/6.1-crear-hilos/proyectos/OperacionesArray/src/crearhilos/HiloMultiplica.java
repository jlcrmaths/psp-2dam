package crearhilos;

public class HiloMultiplica implements Runnable {

    private int[] numeros;

    public HiloMultiplica(int[] numeros) {
        this.numeros = numeros;
    }

    @Override
    public void run() {
        int total = 1;
        for (int i = 0; i < numeros.length; i++) {
            total = total * numeros[i];
        }
        System.out.println(Thread.currentThread().getName() + ": multiplicación = " + total);
    }
}
