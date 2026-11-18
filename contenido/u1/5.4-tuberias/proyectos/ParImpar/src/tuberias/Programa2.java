package tuberias;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Programa2 lee números por su entrada y dice de cada uno si es par o impar.
public class Programa2 {

    public static void main(String[] args) throws IOException {
        BufferedReader entrada = new BufferedReader(new InputStreamReader(System.in));
        String linea;
        while ((linea = entrada.readLine()) != null) {
            // El operador ternario ? : es un if/else en una sola línea:
            // condición ? valor si es verdadera : valor si es falsa.
            System.out.println((Integer.parseInt(linea) % 2 == 0) ? linea + " - par" : linea + " - impar");
        }
    }
}
