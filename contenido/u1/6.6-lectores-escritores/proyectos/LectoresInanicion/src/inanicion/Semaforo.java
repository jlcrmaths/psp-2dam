package inanicion;

// El semáforo controla el acceso de lectores y escritores a unos datos.
// Guarda en qué estado están los datos y hace esperar a quien no puede entrar.
public class Semaforo {

    // Los datos no los usa nadie. Puede entrar un lector o un escritor.
    public static final int LIBRE = 0;
    // Hay lectores leyendo. Pueden entrar más lectores, pero ningún escritor.
    public static final int CON_LECTORES = 1;
    // Hay un escritor escribiendo. No puede entrar nadie.
    public static final int CON_ESCRITOR = 2;

    private int estado = LIBRE;
    private int tLectores = 0;

    // Método auxiliar: da el principio de cada mensaje (el estado y los lectores). Así no se repite en cada println.
    private String info() {
        return "BD:" + estado + " " + tLectores + "L ";
    }

    public synchronized void accesoLeer() {
        String nombre = Thread.currentThread().getName();
        // else if: si no se cumple lo anterior, prueba esta otra condición.
        if (estado == LIBRE) {
            System.out.println(info() + nombre + " entra a leer.");
            estado = CON_LECTORES;
        } else if (estado == CON_ESCRITOR) {
            while (estado == CON_ESCRITOR) {
                System.out.println(info() + nombre + " trata de leer. ESPERA");
                try {
                    wait();
                } catch (InterruptedException e) {
                }
            }
            System.out.println(info() + nombre + " entra a leer.");
            estado = CON_LECTORES;
        } else {
            System.out.println(info() + nombre + " entra a leer.");
        }
        tLectores++;
        System.out.println(info() + nombre + " Leyendo.....");
    }

    public synchronized void accesoEscribir() {
        String nombre = Thread.currentThread().getName();
        while (estado != LIBRE) {
            System.out.println(info() + nombre + " trata de escribir. ESPERA");
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        System.out.println(info() + nombre + " entra a escribir.");
        estado = CON_ESCRITOR;
        System.out.println(info() + nombre + " Escribiendo..");
    }

    public synchronized void escrituraFinalizada() {
        estado = LIBRE;
        System.out.println(Thread.currentThread().getName() + ": Ya ha escrito");
        notify();
    }

    public synchronized void lecturaFinalizada() {
        System.out.println(Thread.currentThread().getName() + ": Ya ha leido");
        tLectores--;
        // Solo el último lector que sale deja los datos libres y avisa.
        if (tLectores == 0) {
            estado = LIBRE;
            notify();
        }
    }
}
