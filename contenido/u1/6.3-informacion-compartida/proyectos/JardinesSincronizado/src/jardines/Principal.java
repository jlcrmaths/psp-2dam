package jardines;

import java.util.ArrayList;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        // Un solo jardín para todos los hilos: es el recurso compartido.
        RecursoJardin jardin = new RecursoJardin();
        ArrayList<Thread> lista = new ArrayList<>();

        for (int i = 1; i <= 10; i++) {
            lista.add(new Thread(new EntraJardin(jardin), "Entra" + i));
            lista.add(new Thread(new SaleJardin(jardin), "Sale" + i));
        }

        for (Thread t : lista) {
            t.start();
        }

        // main espera a que acaben los 20 hilos antes de mostrar el resultado.
        for (Thread t : lista) {
            t.join();
        }

        System.out.println("Personas en el jardín: " + jardin.getCuenta());
    }
}
