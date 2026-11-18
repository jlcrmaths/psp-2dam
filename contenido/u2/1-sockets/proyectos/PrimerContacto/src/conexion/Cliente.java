package conexion;

import java.io.IOException;
import java.net.Socket;

// Cliente se conecta al servidor que escucha en el puerto 12349.
public class Cliente {

    public static void main(String[] args) throws IOException {
        // Socket crea la conexión: nombre del ordenador y puerto del servidor.
        // "localhost" significa este mismo ordenador.
        Socket s = new Socket("localhost", 12349);
        System.out.println("Conectado");
    }
}
