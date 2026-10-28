package fichero;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

// El fichero compartido, ahora de verdad. Sigue entrando un hilo cada vez, pero el hilo recibe el fichero abierto.
public class Fichero {

    // File representa un fichero del disco.
    private final File fichero;
    private int lectores = 0;
    private int escritores = 0;

    // new FileWriter(fichero) sin más crea el fichero vacío (o lo vacía si ya existía). close() lo cierra.
    public Fichero(String nombre) throws IOException {
        this.fichero = new File(nombre);
        new FileWriter(fichero).close();
    }

    // Devuelve el fichero abierto para leer. El lector lo recorre fuera del método, para no bloquear a los demás.
    public synchronized BufferedReader leerFichero() throws InterruptedException, FileNotFoundException {
        while (lectores > 0 || escritores > 0) {
            System.out.println(Thread.currentThread().getName() + ": Hay alguien usando el fichero. Espero.");
            wait();
        }
        lectores++;
        System.out.println(Thread.currentThread().getName() + ": Leyendo fichero. Lectores: " + lectores);
        return new BufferedReader(new FileReader(fichero));
    }

    // Devuelve el fichero abierto para escribir. El segundo argumento true añade al final en vez de borrar.
    public synchronized BufferedWriter escribirFichero() throws InterruptedException, IOException {
        while (lectores > 0 || escritores > 0) {
            System.out.println(Thread.currentThread().getName() + ": Hay alguien usando el fichero. Espero.");
            wait();
        }
        escritores++;
        System.out.println(Thread.currentThread().getName() + ": Escribiendo fichero.");
        return new BufferedWriter(new FileWriter(fichero, true));
    }

    public synchronized void terminaLeer() {
        lectores--;
        System.out.println(Thread.currentThread().getName() + ": He terminado de leer. Lectores: " + lectores);
        notifyAll();
    }

    public synchronized void terminaEscribir() {
        escritores--;
        System.out.println(Thread.currentThread().getName() + ": He terminado de escribir");
        notifyAll();
    }
}
