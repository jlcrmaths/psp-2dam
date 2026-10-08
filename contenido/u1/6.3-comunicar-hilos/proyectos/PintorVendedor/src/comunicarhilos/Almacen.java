package comunicarhilos;

// El almacén es el objeto que comparten los dos hilos. Solo cabe un cuadro.
public class Almacen {

    // boolean es un tipo que solo vale true (verdadero) o false (falso).
    // Aquí dice si hay un cuadro en el almacén.
    private boolean hayCuadro = false;

    // synchronized hace que solo un hilo a la vez pueda estar dentro de este método.
    // Si el pintor está dentro, el vendedor tiene que esperar fuera.
    // Además, wait() y notify() solo se pueden usar dentro de métodos synchronized.
    public synchronized void depositar(int numero) {
        // while repite el bloque mientras se cumpla la condición. Aquí: mientras el almacén esté lleno.
        // Se usa while y no if porque, al despertar, hay que volver a comprobar si ya se puede continuar.
        while (hayCuadro) {
            // try/catch es obligatorio con wait(): puede lanzar InterruptedException,
            // un aviso de que alguien interrumpió la espera. Aquí no hacemos nada con él.
            try {
                // wait() duerme este hilo y suelta el almacén para que otro hilo pueda entrar.
                // Se queda dormido hasta que otro hilo llame a notify().
                wait();
            } catch (InterruptedException e) {
            }
        }
        hayCuadro = true;
        System.out.println(Thread.currentThread().getName() + ": deja el cuadro " + numero);
        // notify() despierta a un hilo que esté esperando en este almacén: ya hay un cuadro.
        notify();
    }

    // Funciona como depositar, pero al revés: espera mientras NO haya cuadro.
    public synchronized void vender(int numero) {
        while (!hayCuadro) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        hayCuadro = false;
        System.out.println(Thread.currentThread().getName() + ": vende el cuadro " + numero);
        notify();
    }
}
