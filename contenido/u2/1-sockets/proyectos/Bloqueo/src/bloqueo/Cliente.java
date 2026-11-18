package bloqueo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

// Cliente de prueba con el mismo fallo: también lee antes de hablar. Los dos esperan para siempre.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        String linea;
        linea = br.readLine();
        System.out.println("El Servidor dice: " + linea);
        pw.println("Hola");
    }
}
