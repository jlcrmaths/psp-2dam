package crearhilos;

public class Principal {

    public static void main(String[] args) {
        Thread hGato = new Thread(new Gato(), "Gato");
        Thread hPerro = new Thread(new Perro(), "Perro");

        // Se arranca primero el gato, pero eso no garantiza que su Miau! salga antes:
        // el orden de ejecución de los hilos lo decide el sistema, no el orden de start().
        hGato.start();
        hPerro.start();
    }
}
