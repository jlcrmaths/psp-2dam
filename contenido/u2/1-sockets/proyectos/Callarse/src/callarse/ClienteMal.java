package callarse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

// ClienteMal cierra todo el socket con close() en vez de shutdownOutput(): después ya no puede escuchar.
public class ClienteMal {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        for (int i = 1; i <= 3; i++) {
            pw.println("Mensaje " + i);
        }
        s.close();
        String linea;
        while ((linea = br.readLine()) != null) {
            System.out.println("El Servidor dice: " + linea);
        }
        br.close();
        pw.close();
        s.close();
    }
}
