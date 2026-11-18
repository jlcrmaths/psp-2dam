package tuberias;

import java.util.Scanner;

// Programa1 es el programa que escribe: muestra nombres de personas, uno por línea.
public class Programa1 {

    public static void main(String[] args) {
        String[] n = {"Fran", "Antonio", "Pepe", "Amalia", "Elena", "Ana", "Diego"};
        Scanner sc = new Scanner(System.in);
        // Todo lo que se muestra con println sale por la "salida" del programa.
        // Si hay una tubería, esa salida viaja al programa siguiente en vez de ir a la pantalla.
        System.out.println("Dime cuántos nombres te muestro: ");
        int num = sc.nextInt();
        while (num <= 0) {
            System.out.println("Dime cuántos nombres te muestro: ");
            num = sc.nextInt();
        }
        for (int i = 0; i < num; i++) {
            // El resto (%) de dividir i entre 7 vuelve a 0 después del último nombre.
            System.out.println(n[i % 7]);
        }
    }
}
