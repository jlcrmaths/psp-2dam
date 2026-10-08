package crearhilos;

// Este hilo busca la nota más alta de un array. Funciona como HiloSuma: el array entra por el constructor.
public class HiloMaximo implements Runnable {

    private int[] notas;

    public HiloMaximo(int[] notas) {
        this.notas = notas;
    }

    @Override
    public void run() {
        // El máximo empieza en la primera nota (posición 0). Si empezara en 0, fallaría con notas negativas.
        int maximo = notas[0];
        // El for empieza en 1: la posición 0 ya está en maximo.
        for (int i = 1; i < notas.length; i++) {
            // if ejecuta lo de las llaves solo si la condición es cierta: aquí, si esta nota supera al máximo actual.
            if (notas[i] > maximo) {
                maximo = notas[i];
            }
        }
        System.out.println(Thread.currentThread().getName() + ": máximo = " + maximo);
    }
}
