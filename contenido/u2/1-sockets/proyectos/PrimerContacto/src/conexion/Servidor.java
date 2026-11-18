package conexion;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor espera a que un cliente se conecte y avisa cuando llega.
public class Servidor {

    public static void main(String[] args) throws IOException {
        // ServerSocket abre un puerto y se queda escuchando en él.
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        // accept() para el programa hasta que un cliente se conecta.
        // Devuelve un Socket: el canal con ese cliente.
        Socket s = ss.accept();
        System.out.println("Conectado");
    }
}
