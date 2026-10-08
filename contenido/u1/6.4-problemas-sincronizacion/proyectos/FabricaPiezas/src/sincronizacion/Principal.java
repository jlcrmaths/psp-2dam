package sincronizacion;

public class Principal {

    // throws InterruptedException avisa de que main puede lanzar ese error (por join) y lo deja pasar,
    // en vez de escribir un try/catch.
    public static void main(String[] args) throws InterruptedException {
        Cinta cinta = new Cinta();

        Thread m1 = new Thread(new Maquina(cinta), "Máquina 1");
        Thread m2 = new Thread(new Maquina(cinta), "Máquina 2");
        Thread m3 = new Thread(new Maquina(cinta), "Máquina 3");
        Thread empaquetador = new Thread(new Empaquetador(cinta), "Empaquetador");

        m1.start();
        m2.start();
        m3.start();
        empaquetador.start();

        // join() hace que main espere a que ese hilo termine antes de seguir con la línea siguiente.
        m1.join();
        m2.join();
        m3.join();
        empaquetador.join();

        System.out.println("Fábrica cerrada");
    }
}
