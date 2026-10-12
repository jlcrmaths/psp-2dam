package sincronizacion;

import java.util.ArrayList;
import java.util.Scanner;

public class Principal {

    public static void main(String[] args) throws InterruptedException {
        Lavanderia lavanderia = new Lavanderia();
        // Scanner lee lo que el usuario escribe por teclado. System.in es el teclado.
        Scanner teclado = new Scanner(System.in);
        // ArrayList es una lista que crece sola. Se usa en vez de un array porque no sabemos
        // cuántos clientes van a llegar. <Thread> dice qué guarda; add() añade uno; get/for lo recorren.
        ArrayList<Thread> clientes = new ArrayList<>();
        int siguiente = 1;
        boolean abierta = true;

        while (abierta) {
            System.out.println("--- Lavandería CleanFast ---");
            System.out.println("1. Simular llegada de clientes");
            System.out.println("2. Mostrar estado de la lavandería");
            System.out.println("3. Cerrar la lavandería");
            System.out.print("Elige una opción: ");
            int opcion = teclado.nextInt();

            switch (opcion) {
                case 1:
                    System.out.print("¿Cuántos clientes llegan? ");
                    int cuantos = teclado.nextInt();
                    for (int i = 0; i < cuantos; i++) {
                        Thread cliente = new Thread(new Cliente(lavanderia), "Cliente " + siguiente);
                        clientes.add(cliente);
                        cliente.start();
                        siguiente++;
                    }
                    break;
                case 2:
                    lavanderia.mostrarEstado();
                    break;
                case 3:
                    // Se sale del menú, así que no entran más clientes.
                    abierta = false;
                    break;
                default:
                    System.out.println("Opción no válida");
            }
        }

        // Este for recorre la lista: en cada vuelta, t es un hilo distinto de clientes.
        // join() espera a que termine: así se espera a todos los que estaban esperando o lavando.
        for (Thread t : clientes) {
            t.join();
        }
        System.out.println("Lavandería cerrada. Todas las lavadoras están libres.");
        lavanderia.mostrarEstado();
    }
}
