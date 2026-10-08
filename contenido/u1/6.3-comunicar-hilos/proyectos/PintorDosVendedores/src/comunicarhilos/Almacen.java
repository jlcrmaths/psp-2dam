package comunicarhilos;

// Como el almacén del ejercicio anterior, pero ahora los vendedores no saben cuántos cuadros se van a pintar.
// Por eso el almacén también apunta cuándo se ha terminado.
public class Almacen {

    private boolean hayCuadro = false;
    // Número del cuadro que hay en el almacén.
    private int cuadro = 0;
    // Pasa a true cuando el pintor ya no va a pintar más.
    private boolean terminado = false;

    public synchronized void depositar(int numero) {
        while (hayCuadro) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        hayCuadro = true;
        cuadro = numero;
        System.out.println(Thread.currentThread().getName() + ": deja el cuadro " + numero);
        // notifyAll() despierta a TODOS los hilos que esperan. Con notify() podría despertarse
        // solo al otro vendedor, que seguiría esperando, y el programa se quedaría parado.
        notifyAll();
    }

    // Devuelve true si ha vendido un cuadro y false si ya no queda nada que vender.
    public synchronized boolean vender() {
        // Espera mientras no haya cuadro Y el pintor no haya terminado.
        // && significa "y": las dos condiciones a la vez.
        while (!hayCuadro && !terminado) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        // Si se sale del while sin cuadro es porque el pintor ha terminado.
        if (!hayCuadro) {
            return false;
        }
        hayCuadro = false;
        System.out.println(Thread.currentThread().getName() + ": vende el cuadro " + cuadro);
        notifyAll();
        return true;
    }

    // El pintor la llama al acabar. Despierta a los vendedores que siguen esperando para que terminen.
    public synchronized void terminar() {
        terminado = true;
        notifyAll();
    }
}
