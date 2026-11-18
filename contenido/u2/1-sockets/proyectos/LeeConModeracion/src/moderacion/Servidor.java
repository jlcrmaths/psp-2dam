package moderacion;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor contesta «Hola» a cada mensaje del cliente, leyendo una sola línea por vuelta.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        String linea;
        // La condición lee la línea, la guarda en linea y comprueba que no sea null, todo a la vez.
        // Dentro del bucle se usa linea: no se vuelve a llamar a readLine().
        while ((linea = br.readLine()) != null) {
            System.out.println("El cliente dice: " + linea);
            pw.println("Hola");
        }
        System.out.println("Cliente desconectado");
    }
}
