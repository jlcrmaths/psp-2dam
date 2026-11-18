package tuberias;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Programa2 lee números por su entrada y calcula el promedio de los mayores que 50.
public class Programa2 {

    public static void main(String[] args) throws IOException {
        BufferedReader entrada = new BufferedReader(new InputStreamReader(System.in));
        String linea;
        int suma = 0;
        int cuantos = 0;
        while ((linea = entrada.readLine()) != null) {
            int n = Integer.parseInt(linea);
            if (n > 50) {
                suma = suma + n;
                cuantos++;
            }
        }
        if (cuantos == 0) {
            System.out.println("Ningún número es mayor que 50");
        } else {
            // (double) convierte la suma en decimal antes de dividir; sin él, la división sería entera y perdería los decimales.
            double promedio = (double) suma / cuantos;
            System.out.println("Promedio de los mayores que 50: " + promedio);
        }
    }
}
