package cierre;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor del diálogo, ahora cerrando todo al terminar.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        System.out.println("Conectado");
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        String linea;
        linea = br.readLine();
        System.out.println("El cliente dice: " + linea);
        pw.println("Hola, cliente");
        // close() libera cada recurso. Se cierra en orden inverso al que se abrió: canales, socket y ServerSocket.
        br.close();
        pw.close();
        s.close();
        ss.close();
    }
}
