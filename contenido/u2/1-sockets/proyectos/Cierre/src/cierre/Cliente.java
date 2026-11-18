package cierre;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

// Cliente del diálogo, ahora cerrando todo al terminar.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        pw.println("Hola");
        String linea;
        linea = br.readLine();
        System.out.println("El Servidor dice: " + linea);
        br.close();
        pw.close();
        s.close();
    }
}
