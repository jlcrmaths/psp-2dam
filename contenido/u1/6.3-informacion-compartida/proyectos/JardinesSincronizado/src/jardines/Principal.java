package jardines;

public class Principal {

    public static void main(String[] args) {
        // Un solo jardín para todos los hilos: es el recurso compartido.
        RecursoJardin jardin = new RecursoJardin();

        for (int i = 1; i <= 1000; i++) {
            new Thread(new EntraJardin(jardin), "Entra" + i).start();
        }

        for (int i = 1; i <= 1000; i++) {
            new Thread(new SaleJardin(jardin), "Sale" + i).start();
        }
    }
}
