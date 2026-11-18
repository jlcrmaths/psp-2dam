package tuberias;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Programa2 es el programa que lee: recibe nombres por su entrada y saluda a cada uno.
public class Programa2 {

    // throws IOException avisa de que leer puede fallar; así no hace falta try/catch.
    public static void main(String[] args) throws IOException {
        // System.in es la entrada del programa: el teclado o, si hay tubería, la salida del otro programa.
        // InputStreamReader convierte lo que llega en texto y BufferedReader permite leerlo línea a línea.
        BufferedReader entrada = new BufferedReader(new InputStreamReader(System.in));
        String linea;
        // Aquí readLine() se llama dentro del while: lee la línea, la guarda en linea y comprueba si es null.
        // readLine() devuelve null cuando el programa de antes ya no tiene nada más que enviar.
        while ((linea = entrada.readLine()) != null) {
            System.out.println("Hola " + linea);
        }
    }
}
