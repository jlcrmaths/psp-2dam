package moderacion;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

// Cliente envía tres mensajes, uno cada vez, y muestra la respuesta de cada uno.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        for (int i = 1; i <= 3; i++) {
            pw.println("Mensaje " + i);
            String linea = br.readLine();
            System.out.println("El Servidor dice: " + linea);
        }
        br.close();
        pw.close();
        s.close();
    }
}
