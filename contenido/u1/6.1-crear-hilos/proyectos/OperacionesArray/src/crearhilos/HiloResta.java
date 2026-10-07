package crearhilos;

// Funciona como HiloSuma: el array entra por el constructor y run() lo recorre.
public class HiloResta implements Runnable {

    private int[] numeros;

    public HiloResta(int[] numeros) {
        this.numeros = numeros;
    }

    @Override
    public void run() {
        // La resta empieza en el primer número del array (posición 0) y se le restan los demás.
        // Si empezara en 0 el resultado saldría mal.
        int total = numeros[0];
        // Por eso el for empieza en 1: la posición 0 ya está en total.
        for (int i = 1; i < numeros.length; i++) {
            total = total - numeros[i];
        }
        System.out.println(Thread.currentThread().getName() + ": resta = " + total);
    }
}
