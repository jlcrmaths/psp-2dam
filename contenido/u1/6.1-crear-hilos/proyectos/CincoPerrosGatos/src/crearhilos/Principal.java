package crearhilos;

public class Principal {

    public static void main(String[] args) {
        Thread[] gatos = new Thread[5];
        Thread[] perros = new Thread[5];

        for (int i = 0; i < 5; i++) {
            gatos[i] = new Thread(new Gato(), "Gato " + (i + 1));
            perros[i] = new Thread(new Perro(), "Perro " + (i + 1));
            gatos[i].start();
            perros[i].start();
        }
    }
}
