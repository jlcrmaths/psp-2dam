package lineas;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

// Cliente lee los dos mensajes: cada readLine() recibe una línea entera.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        String linea;
        // readLine() lee hasta el salto de línea y devuelve el texto sin él.
        linea = br.readLine();
        System.out.println("Recibido: " + linea);
        linea = br.readLine();
        System.out.println("Recibido: " + linea);
    }
}
