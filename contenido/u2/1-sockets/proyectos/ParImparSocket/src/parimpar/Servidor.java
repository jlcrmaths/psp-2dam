package parimpar;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

// Servidor recibe números y contesta a cada uno si es par o impar.
public class Servidor {

    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(12349);
        System.out.println("Esperando conexión...");
        Socket s = ss.accept();
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        String linea;
        // Se repite mientras lleguen líneas. Cuando el cliente cierra la conexión, readLine() devuelve null.
        while ((linea = br.readLine()) != null) {
            int n = Integer.parseInt(linea);
            pw.println(n % 2 == 0 ? "par" : "impar");
        }
        System.out.println("Cliente desconectado");
    }
}
