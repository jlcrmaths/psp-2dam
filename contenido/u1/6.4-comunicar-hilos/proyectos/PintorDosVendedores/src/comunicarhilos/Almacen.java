package comunicarhilos;

// Como el almacén del ejercicio anterior, pero ahora los vendedores no saben cuántos cuadros se van a pintar.
// Por eso el almacén cuenta los cuadros pintados y los vendidos.
public class Almacen {

    private int numCuadros = 0;
    private int numMaxCuadros;
    // Cuántos cuadros se han pintado y cuántos se han vendido hasta ahora.
    private int numCuadrosPintados = 0;
    private int numCuadrosVendidos = 0;

    public Almacen(int numMaxCuadros) {
        this.numMaxCuadros = numMaxCuadros;
    }

    public synchronized void depositar(int numero) {
        while (numCuadros == numMaxCuadros) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        numCuadros++;
        numCuadrosPintados++;
        System.out.println(Thread.currentThread().getName() + ": deja el cuadro " + numero + ". En el almacén: " + numCuadros);
        // notifyAll() despierta a TODOS los hilos que esperan. Con notify() podría despertarse
        // solo al otro vendedor, que seguiría esperando, y el programa se quedaría parado.
        notify();
    }

    public synchronized void vender() {
        // Espera mientras no haya cuadros Y todavía falten cuadros por pintar.
        // && significa "y": las dos condiciones a la vez.
        while (numCuadros == 0 && numCuadrosPintados < 10) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        if (numCuadros > 0) {
            numCuadros--;
            numCuadrosVendidos++;
            System.out.println(Thread.currentThread().getName() + ": vende un cuadro. En el almacén: " + numCuadros);
            notify();
        } else {
            // Sin cuadros y con los 10 pintados: no va a haber más.
            System.out.println(Thread.currentThread().getName() + ": no quedan cuadros y el pintor ha terminado, me voy.");
        }
    }

    public synchronized int getCuadrosVendidos() {
        return numCuadrosVendidos;
    }
}
