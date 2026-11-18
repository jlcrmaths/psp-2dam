package tuberias;

import java.util.Scanner;

// Programa1 lee una línea del teclado y la escribe al revés.
public class Programa1 {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String t = sc.nextLine();
        // StringBuilder es un texto que se puede modificar. reverse() le da la vuelta.
        // toString() lo convierte otra vez en un String normal.
        String al = new StringBuilder(t).reverse().toString();
        System.out.println(al);
    }
}
