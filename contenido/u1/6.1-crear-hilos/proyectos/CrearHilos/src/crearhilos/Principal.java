package crearhilos;

public class Principal {

    // main es donde empieza a ejecutarse el programa. Java lo ejecuta en un hilo llamado "main".
    public static void main(String[] args) {
        // new Thread(objeto, nombre) crea un hilo. El objeto (un Runnable) es el trabajo que hará
        // y el nombre sirve para reconocer el hilo. Todavía no está en marcha.
        Thread h1 = new Thread(new Contador(), "Hilo 1");
        Thread h2 = new Thread(new Contador(), "Hilo 2");
        Thread h3 = new Thread(new Contador(), "Hilo 3");

        // start() pone el hilo en marcha: Java crea el hilo y llama a run() dentro de él.
        // Si llamaras a run() directamente, no habría hilo nuevo: se ejecutaría en el hilo main.
        h1.start();
        h2.start();
        h3.start();
    }
}
