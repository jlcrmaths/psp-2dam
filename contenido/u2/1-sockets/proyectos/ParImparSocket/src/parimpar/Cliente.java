package parimpar;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

// Cliente envía 25 números al servidor y muestra si cada uno es par o impar.
public class Cliente {

    public static void main(String[] args) throws IOException {
        Socket s = new Socket("localhost", 12349);
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
        for (int i = 0; i < 25; i++) {
            int n = (int) (Math.random() * 101);
            pw.println(n);
            String linea = br.readLine();
            System.out.println(n + " – " + linea);
        }
    }
}
