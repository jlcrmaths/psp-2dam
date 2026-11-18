package callarse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor contesta a cada mensaje y termina cuando el cliente deja de hablar.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        String linea;
        while ((linea = br.readLine()) != null) {
            System.out.println("El cliente dice: " + linea);
            pw.println("Recibido: " + linea);
        }
        System.out.println("El cliente ya no habla");
        br.close();
        pw.close();
        s.close();
        ss.close();
    }
}
