package comunicarhilos;

// Como el almacén del ejercicio anterior, pero ahora los vendedores no saben cuántos cuadros se van a pintar.
// Por eso el almacén también apunta cuándo se ha terminado.
public class Almacen {

    private int cuadros = 0;
    private int capacidad;
    // Pasa a true cuando el pintor ya no va a pintar más.
    private boolean terminado = false;

    public Almacen(int capacidad) {
        this.capacidad = capacidad;
    }

    public synchronized void depositar(int numero) {
        while (cuadros == capacidad) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        cuadros++;
        System.out.println(Thread.currentThread().getName() + ": deja el cuadro " + numero + ". En el almacén: " + cuadros);
        // notifyAll() despierta a TODOS los hilos que esperan. Con notify() podría despertarse
        // solo al otro vendedor, que seguiría esperando, y el programa se quedaría parado.
        notifyAll();
    }

    // Devuelve true si ha vendido un cuadro y false si ya no queda nada que vender.
    public synchronized boolean vender() {
        // Espera mientras no haya ningún cuadro Y el pintor no haya terminado.
        // && significa "y": las dos condiciones a la vez.
        while (cuadros == 0 && !terminado) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        // Si se sale del while sin cuadros es porque el pintor ha terminado.
        if (cuadros == 0) {
            return false;
        }
        cuadros--;
        System.out.println(Thread.currentThread().getName() + ": vende un cuadro. En el almacén: " + cuadros);
        notifyAll();
        return true;
    }

    // El pintor la llama al acabar. Despierta a los vendedores que siguen esperando para que terminen.
    public synchronized void terminar() {
        terminado = true;
        notifyAll();
    }
}
