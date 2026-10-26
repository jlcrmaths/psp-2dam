package sincronizacion;

public class Principal {

    // throws InterruptedException: main deja pasar el error de join() en vez de escribir un try/catch.
    public static void main(String[] args) throws InterruptedException {

        // Creamos recurso compartido
        CintaTransportadora cinta = new CintaTransportadora();

        // Creamos los distintos hilos
        // final: el valor no se puede cambiar después.
        final int numCreadoras = 3;
        final int numEmpaquetadoras = 1;
        Thread[] maquinasCreadoras = new Thread[numCreadoras];
        Thread[] maquinasEmpaquetadoras = new Thread[numEmpaquetadoras];

        for (int i = 0; i < numCreadoras; i++) {
            maquinasCreadoras[i] = new Thread(new MaquinaCreadora(cinta), "Creadora" + i);
        }
        for (int i = 0; i < numEmpaquetadoras; i++) {
            maquinasEmpaquetadoras[i] = new Thread(new MaquinaEmpaquetadora(cinta), "Empaquetadora" + i);
        }

        // Lanzamos los hilos
        for (Thread hilo : maquinasCreadoras) {
            hilo.start();
        }
        for (Thread hilo : maquinasEmpaquetadoras) {
            hilo.start();
        }

        // Esperamos a los hilos
        // join() hace que main espere a que ese hilo termine antes de seguir con la línea siguiente.
        for (Thread hilo : maquinasCreadoras) {
            hilo.join();
        }
        for (Thread hilo : maquinasEmpaquetadoras) {
            hilo.join();
        }

        // Mensaje final
        System.out.println("Fábrica cerrada");
    }
}
