package sincronizacion;

// La cinta transportadora: es el objeto que comparten las máquinas creadoras y la empaquetadora.
public class CintaTransportadora {

    // static final: constantes de la clase. Su valor no cambia y se escriben en MAYÚSCULAS.
    private static final int CAPACIDAD = 5;
    private static final int TOTAL_PIEZAS = 50;

    private int piezasCinta = 0;
    private int piezasCreadas = 0;
    private int piezasEmpaquetadas = 0;
    // Banderas: avisan de que ya no hay que seguir. Empiezan en true y pasan a false una sola vez.
    private boolean seguirFabricando = true;
    private boolean seguirEmpaquetando = true;

    // Devuelve true si la máquina debe seguir creando y false cuando ya se han creado todas las piezas.
    // throws InterruptedException: wait() puede lanzar ese error y el método lo deja pasar a quien lo llama.
    public synchronized boolean crearPieza() throws InterruptedException {
        // Si la cinta está llena, la máquina espera a que la empaquetadora retire una pieza.
        while (piezasCinta == CAPACIDAD) {
            System.out.println("No puedo crear piezas. Cinta llena: " + piezasCinta + ".");
            wait();
        }
        if (piezasCreadas >= TOTAL_PIEZAS) {
            seguirFabricando = false;
        } else {
            piezasCinta++;
            piezasCreadas++;
            System.out.println("Pieza creada. Total en cinta: " + piezasCinta + ". Creadas: " + piezasCreadas);
        }
        // Hay creadoras y una empaquetadora esperando en la misma cinta: se avisa a todos.
        notifyAll();
        return seguirFabricando;
    }

    // Devuelve true si la empaquetadora debe seguir y false cuando ya no queda nada por empaquetar.
    public synchronized boolean empaquetar() throws InterruptedException {
        // Espera si la cinta está vacía y todavía se están creando piezas.
        while (piezasCinta == 0 && seguirFabricando) {
            System.out.println("No puedo empaquetar piezas. Cinta vacía: " + piezasCinta + ".");
            wait();
        }
        // Cinta vacía y ya no se crean más: se acabó.
        if (piezasCinta == 0 && !seguirFabricando) {
            seguirEmpaquetando = false;
        } else {
            piezasCinta--;
            piezasEmpaquetadas++;
            System.out.println("Pieza empaquetada. Total en cinta: " + piezasCinta + ". Empaquetadas: " + piezasEmpaquetadas);
            notifyAll();
        }
        return seguirEmpaquetando;
    }
}
