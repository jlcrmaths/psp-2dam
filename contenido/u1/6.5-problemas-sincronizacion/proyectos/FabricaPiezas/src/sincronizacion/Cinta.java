package sincronizacion;

// La cinta transportadora: cabe un máximo de 5 piezas.
// Es el objeto que comparten las tres máquinas y el empaquetador.
public class Cinta {

    private int piezas = 0;
    // Cuántas piezas se han fabricado en total entre las tres máquinas. La fábrica para al llegar a 50.
    private int fabricadas = 0;

    // Devuelve true si ha puesto una pieza y false si ya se han fabricado las 50.
    public synchronized boolean poner() {
        // Espera mientras la cinta esté llena Y falten piezas por fabricar.
        while (piezas == 5 && fabricadas < 50) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        if (fabricadas == 50) {
            return false;
        }
        piezas++;
        fabricadas++;
        System.out.println(Thread.currentThread().getName() + ": pone la pieza " + fabricadas + ". Cinta: " + piezas + "/5");
        // Hay tres máquinas y un empaquetador esperando en la misma cinta: notifyAll para no despertar al equivocado.
        notifyAll();
        return true;
    }

    public synchronized void retirar() {
        while (piezas == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        piezas--;
        System.out.println(Thread.currentThread().getName() + ": retira una pieza. Cinta: " + piezas + "/5");
        notifyAll();
    }
}
