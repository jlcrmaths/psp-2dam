package tuberias;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Programa2 lee la línea invertida por su entrada y escribe cuántos caracteres tiene.
public class Programa2 {

    public static void main(String[] args) throws IOException {
        BufferedReader entrada = new BufferedReader(new InputStreamReader(System.in));
        String linea = entrada.readLine();
        System.out.println("Caracteres: " + linea.length());
    }
}
