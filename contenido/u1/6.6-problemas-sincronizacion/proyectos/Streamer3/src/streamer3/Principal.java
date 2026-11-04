package streamer3;

import java.util.Scanner;

public class Principal {

    public static void main(String[] args) {
        Sala sala = new Sala();
        int njug = 1;
        int nesp = 1;
        int aux;
        int opcion;
        Scanner sc = new Scanner(System.in);

        System.out.println("Introduce una opción:");
        System.out.println("\t 1: Nuevo jugador");
        System.out.println("\t 2: Más espectadores");
        System.out.println("\t 3: Saber estado de la sala");
        System.out.println("\t 4: Salir");

        do {
            opcion = sc.nextInt();

            switch (opcion) {
                case 1:
                    new Thread(new Jugador(sala), "Jugador" + njug).start();
                    System.out.println("Jugador" + njug + " creado.\n");
                    njug++;
                    break;
                case 2:
                    System.out.println("Introduce cuántos espectadores quieres crear:");
                    aux = sc.nextInt();
                    for (int i = 0; i < aux; i++) {
                        new Thread(new Espectador(sala), "Espectador" + nesp).start();
                        System.out.println("Espectador" + nesp + " creado.\n");
                        nesp++;
                    }
                    break;
                case 3:
                    System.out.println("\n\nEstado de la sala: " + sala.getInfoSala());
                    break;
                case 4:
                    sala.cerrarSala();
                    break;
            }
        } while (opcion != 4);
    }
}
