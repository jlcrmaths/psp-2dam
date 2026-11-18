package canales;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor acepta al cliente y prepara los dos canales: uno para escuchar y otro para hablar.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        // BufferedReader para escuchar: lee texto línea a línea de lo que envía el cliente.
        // InputStreamReader convierte los bytes que llegan en caracteres.
        // getInputStream() de la clase Socket da la entrada de datos del socket.
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        // PrintWriter para hablar: escribe texto y lo envía al cliente.
        // getOutputStream() de la clase Socket da la salida de datos del socket.
        // El true (autoFlush) envía cada línea en cuanto se escribe con println.
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        System.out.println("Canales listos");
    }
}
