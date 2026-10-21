package comunicarhilos;

// El almacén es el objeto que comparten los dos hilos. Caben tantos cuadros como diga el constructor.
public class Almacen {

    // Cuántos cuadros hay ahora en el almacén, como los cuchillos libres de la cocina.
    private int numCuadros = 0;
    // Cuántos cuadros caben como máximo. Llega por el constructor.
    private int numMaxCuadros;

    public Almacen(int numMaxCuadros) {
        this.numMaxCuadros = numMaxCuadros;
    }

    // synchronized hace que solo un hilo a la vez pueda estar dentro de este método.
    // Si el pintor está dentro, el vendedor tiene que esperar fuera.
    // Además, wait() y notify() solo se pueden usar dentro de métodos synchronized.
    public synchronized void depositar(int numero) {
        // while repite el bloque mientras se cumpla la condición. Aquí: mientras el almacén esté lleno (no quepa otro cuadro).
        // Se usa while y no if porque, al despertar, hay que volver a comprobar si ya se puede continuar.
        while (numCuadros == numMaxCuadros) {
            // try/catch es obligatorio con wait(): puede lanzar InterruptedException,
            // un aviso de que alguien interrumpió la espera. Aquí no hacemos nada con él.
            try {
                // wait() duerme este hilo y suelta el almacén para que otro hilo pueda entrar.
                // Se queda dormido hasta que otro hilo llame a notify().
                wait();
            } catch (InterruptedException e) {
            }
        }
        numCuadros++;
        System.out.println(Thread.currentThread().getName() + ": deja el cuadro " + numero + ". En el almacén: " + numCuadros);
        // notify() despierta a un hilo que esté esperando en este almacén: ya hay un cuadro.
        notify();
    }

    // Funciona como depositar, pero al revés: espera mientras no haya ningún cuadro.
    public synchronized void vender(int numero) {
        while (numCuadros == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        numCuadros--;
        System.out.println(Thread.currentThread().getName() + ": vende el cuadro " + numero + ". En el almacén: " + numCuadros);
        notify();
    }
}
