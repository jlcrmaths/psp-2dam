package tuberias;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Programa2 lee números por su entrada y suma solo los pares.
public class Programa2 {

    public static void main(String[] args) throws IOException {
        BufferedReader entrada = new BufferedReader(new InputStreamReader(System.in));
        String linea;
        int suma = 0;
        while ((linea = entrada.readLine()) != null) {
            // Integer.parseInt() convierte el texto de la línea en un número entero.
            int n = Integer.parseInt(linea);
            // Un número es par si el resto (%) de dividirlo entre 2 es 0.
            if (n % 2 == 0) {
                suma = suma + n;
            }
        }
        System.out.println("Suma de los pares: " + suma);
    }
}
