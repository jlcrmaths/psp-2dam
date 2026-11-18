package flush;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor envía un saludo al cliente. El true del PrintWriter hace que se envíe al momento.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        pw.println("Hola, cliente");
        System.out.println("Saludo enviado");
    }
}
