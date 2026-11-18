package lineas;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor envía dos mensajes. Cada println() termina con un salto de línea.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        pw.println("Hola");
        pw.println("¿Qué tal?");
        System.out.println("Mensajes enviados");
    }
}
