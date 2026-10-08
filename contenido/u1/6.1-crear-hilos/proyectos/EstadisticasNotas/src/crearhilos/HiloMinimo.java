package crearhilos;

// Funciona como HiloMaximo, pero busca la nota más baja.
public class HiloMinimo implements Runnable {

    private int[] notas;

    public HiloMinimo(int[] notas) {
        this.notas = notas;
    }

    @Override
    public void run() {
        // El mínimo también empieza en la primera nota. Si empezara en 0, ninguna nota sería menor y siempre saldría 0.
        int minimo = notas[0];
        for (int i = 1; i < notas.length; i++) {
            if (notas[i] < minimo) {
                minimo = notas[i];
            }
        }
        System.out.println(Thread.currentThread().getName() + ": mínimo = " + minimo);
    }
}
