package sincronizacion;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Panaderia panaderia = new Panaderia();
        Thread hiloPanadero = new Thread(new Panadero(panaderia), "Panadero");
        List<Thread> clientes = new ArrayList<>();
        Scanner sc = new Scanner(System.in);
        int clienteId = 1;
        int opcion;

        hiloPanadero.start();

        System.out.println("--- Menú Panadería ---");
        System.out.println("1. Llegada de un grupo de clientes");
        System.out.println("2. Ver estado del mostrador");
        System.out.println("3. Cerrar la panadería");
        System.out.print("Elige una opción: ");

        do {
            opcion = sc.nextInt();

            switch (opcion) {
                case 1:
                    System.out.print("Número de clientes que llegan juntos: ");
                    int numClientes = sc.nextInt();
                    while (numClientes <= 0) {
                        System.out.println("El número de clientes debe ser mayor que cero.");
                        numClientes = sc.nextInt();
                    }
                    // Primero se pregunta lo que quiere cada uno y después se lanzan todos a la vez.
                    List<Thread> grupo = new ArrayList<>();
                    for (int i = 0; i < numClientes; i++) {
                        System.out.print("¿Cuántas barras quiere el cliente " + clienteId + " (1-10)? ");
                        int barras = sc.nextInt();
                        while (barras < 1 || barras > 10) {
                            System.out.println("Número de barras no válido. Deben ser entre 1 y 10.");
                            barras = sc.nextInt();
                        }
                        grupo.add(new Thread(new Cliente(panaderia, barras), "Cliente" + clienteId));
                        clienteId++;
                    }
                    for (Thread cliente : grupo) {
                        clientes.add(cliente);
                        cliente.start();
                    }
                    break;
                case 2:
                    panaderia.mostrarInfo();
                    break;
                case 3:
                    System.out.println("Cerrando la panadería...");
                    // Primero se atiende a todos los clientes: los que esperan pan necesitan que el panadero siga horneando.
                    for (Thread cliente : clientes) {
                        cliente.join();
                    }
                    panaderia.cerrarPanaderia();
                    hiloPanadero.join();
                    panaderia.mensajeCierre();
                    break;
                default:
                    System.out.println("Opción no válida. Intenta de nuevo.");
            }
        } while (opcion != 3);
    }
}
