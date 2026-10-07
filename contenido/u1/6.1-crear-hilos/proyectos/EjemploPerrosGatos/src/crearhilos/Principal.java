package crearhilos;

public class Principal {

    public static void main(String[] args) {
        Thread hGato = new Thread(new Gato(), "Gato");
        Thread hPerro = new Thread(new Perro(), "Perro");

        hGato.start();
        hPerro.start();
    }
}
