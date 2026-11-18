package tuberias;

// Programa1 es el programa que escribe: muestra 25 números al azar (de 0 a 100), uno por línea.
public class Programa1 {

    public static void main(String[] args) {
        for (int i = 0; i < 25; i++) {
            // Cada println es una línea que viaja por la tubería hasta Programa2.
            System.out.println((int) (Math.random() * 101));
        }
    }
}
