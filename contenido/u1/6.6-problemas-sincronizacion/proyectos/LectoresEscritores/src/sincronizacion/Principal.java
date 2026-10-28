package sincronizacion;

public class Principal {

    public static void main(String[] args) {
        // Un solo fichero compartido por los 20 hilos.
        Fichero fichero = new Fichero("escritores.txt");

        for (int i = 1; i <= 10; i++) {
            Thread escritor = new Thread(new Escritor(fichero), "Escritor " + i);
            Thread lector = new Thread(new Lector(fichero), "Lector " + i);
            escritor.start();
            lector.start();
        }
    }
}
