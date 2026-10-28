package sincronizacion;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Principal {

    // throws Exception: main deja pasar cualquier error (aquí, el de join()) en vez de escribir un try/catch.
    public static void main(String[] args) throws Exception {
        int menu = 0;
        int numClientes;
        // contador: cuántos clientes han llegado en total. Da nombre a cada cliente y dice qué hilo toca arrancar.
        int contador = 0;
        // List es la forma general de decir «una lista de hilos»; ArrayList es la lista concreta que se crea.
        List<Thread> Hilos = new ArrayList<>();
        Scanner sc = new Scanner(System.in);

        Lavanderia CleanFast = new Lavanderia();

        System.out.println("Bienvenido a CleanFast. Elige opción:\n 1-Llegada de clientes.\n 2-Estado de la lavandería.\n 3-Cerrar la lavandería.");

        // do { … } while (condición): repite el bloque y mira la condición al final. Se ejecuta siempre al menos una vez.
        do {
            menu = sc.nextInt();

            switch (menu) {
                case 1:
                    System.out.println("¿Cuántos clientes llegan a la vez?");
                    numClientes = contador + sc.nextInt();
                    for (int i = contador; i < numClientes; i++, contador++) {
                        Hilos.add(new Thread(new Cliente(CleanFast), "Cliente " + (contador + 1)));
                        Hilos.get(contador).start();
                    }
                    break;
                case 2:
                    CleanFast.mostrarInfo();
                    break;
                case 3:
                    System.out.println("Cerramos tienda. Esperamos a que terminen de lavar");
                    for (Thread hilo : Hilos) {
                        hilo.join();
                    }
                    break;
                default:
                    System.out.println("Selección no válida.");
                    break;
            }

        } while (menu != 3);
    }
}
