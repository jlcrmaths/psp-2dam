package crearhilos;

public class HiloResta implements Runnable {

    private int[] numeros;

    public HiloResta(int[] numeros) {
        this.numeros = numeros;
    }

    @Override
    public void run() {
        int total = numeros[0];
        for (int i = 1; i < numeros.length; i++) {
            total = total - numeros[i];
        }
        System.out.println(Thread.currentThread().getName() + ": resta = " + total);
    }
}
