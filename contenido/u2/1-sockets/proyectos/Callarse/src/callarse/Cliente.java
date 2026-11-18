package callarse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

// Cliente envía tres mensajes, deja de hablar con shutdownOutput() y sigue escuchando las respuestas.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        for (int i = 1; i <= 3; i++) {
            pw.println("Mensaje " + i);
        }
        // shutdownOutput() cierra solo la salida: el servidor sabe que no hablo más, pero yo puedo seguir escuchando.
        s.shutdownOutput();
        String linea;
        while ((linea = br.readLine()) != null) {
            System.out.println("El Servidor dice: " + linea);
        }
        br.close();
        pw.close();
        s.close();
    }
}
