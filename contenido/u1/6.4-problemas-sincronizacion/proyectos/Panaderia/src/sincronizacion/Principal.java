package sincronizacion;

import java.util.ArrayList;
import java.util.Scanner;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Mostrador mostrador = new Mostrador();
        Scanner teclado = new Scanner(System.in);
        ArrayList<Thread> clientes = new ArrayList<>();
        int siguiente = 1;

        Thread panadero = new Thread(new Panadero(mostrador), "Panadero");
        panadero.start();

        boolean abierta = true;
        while (abierta) {
            System.out.println("--- Menú Panadería ---");
            System.out.println("1. Llegada de un grupo de clientes");
            System.out.println("2. Ver estado del mostrador");
            System.out.println("3. Cerrar la panadería");
            System.out.print("Elige una opción: ");
            int opcion = teclado.nextInt();

            switch (opcion) {
                case 1:
                    System.out.print("Número de clientes que llegan juntos: ");
                    int cuantos = teclado.nextInt();
                    // Primero se pregunta lo que quiere cada uno y después se lanzan todos a la vez.
                    int[] pedidos = new int[cuantos];
                    for (int i = 0; i < cuantos; i++) {
                        int pedido = 0;
                        while (pedido < 1 || pedido > 10) {
                            System.out.print("¿Cuántas barras quiere el cliente " + (siguiente + i) + " (1-10)? ");
                            pedido = teclado.nextInt();
                        }
                        pedidos[i] = pedido;
                    }
                    for (int i = 0; i < cuantos; i++) {
                        Thread cliente = new Thread(new Cliente(mostrador, pedidos[i]), "Cliente " + siguiente);
                        clientes.add(cliente);
                        cliente.start();
                        siguiente++;
                    }
                    break;
                case 2:
                    mostrador.mostrarEstado();
                    break;
                case 3:
                    abierta = false;
                    break;
                default:
                    System.out.println("Opción no válida");
            }
        }

        System.out.println("Cerrando la panadería...");
        // Primero se atiende a todos los clientes: los que esperan pan necesitan que el panadero siga horneando.
        for (Thread t : clientes) {
            t.join();
        }
        mostrador.cerrar();
        panadero.join();
        mostrador.mostrarResumen();
        System.out.println("Panadero dejó listas las barras para mañana. ¡Hasta luego!");
    }
}
