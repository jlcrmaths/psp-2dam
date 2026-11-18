package flush;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

// Cliente espera el saludo del servidor y lo muestra.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        // readLine() también es bloqueante: espera hasta que llega una línea entera.
        String linea = br.readLine();
        System.out.println("El servidor dice: " + linea);
    }
}
