package crearhilos;

public class Principal {

    public static void main(String[] args) {
        // Thread[] es un array: una fila de casillas donde guardar varios hilos.
        // new Thread[5] crea la fila con 5 casillas vacías. Las posiciones se numeran de 0 a 4.
        Thread[] gatos = new Thread[5];
        Thread[] perros = new Thread[5];

        // Este for se repite 5 veces: i vale 0, 1, 2, 3 y 4 y se para cuando i < 5 deja de cumplirse.
        for (int i = 0; i < 5; i++) {
            // gatos[i] es la casilla número i del array. Ahí se guarda el hilo recién creado.
            // "Gato " + (i + 1) pega el texto y el número: Gato 1, Gato 2...
            // Los paréntesis son necesarios: sin ellos saldría "Gato 01" en vez de "Gato 1".
            gatos[i] = new Thread(new Gato(), "Gato " + (i + 1));
            perros[i] = new Thread(new Perro(), "Perro " + (i + 1));
            // Se arrancan en la misma vuelta del for, uno de cada.
            gatos[i].start();
            perros[i].start();
        }
    }
}
