package tuberias;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Principal lanza Programa1 como un proceso nuevo y muestra por pantalla lo que ese proceso escribe.
public class Principal {

    public static void main(String[] args) throws IOException {
        // ProcessBuilder prepara un comando, igual que lo escribirías en la terminal.
        // Aquí: java -cp (dónde están las clases) tuberias.Programa1
        // System.getProperty("java.class.path") da la carpeta o el .jar de este mismo programa.
        ProcessBuilder pb = new ProcessBuilder("java", "-cp", System.getProperty("java.class.path"), "tuberias.Programa1");
        // start() ejecuta el comando: nace un proceso nuevo y start() devuelve un objeto Process para controlarlo.
        Process programa1 = pb.start();
        // getInputStream() es lo que el proceso escribe con println, visto desde aquí.
        // Es la tubería: la salida de Programa1 llega a la entrada de Principal.
        BufferedReader br = new BufferedReader(new InputStreamReader(programa1.getInputStream()));
        String linea;
        while ((linea = br.readLine()) != null) {
            System.out.println(linea);
        }
    }
}
