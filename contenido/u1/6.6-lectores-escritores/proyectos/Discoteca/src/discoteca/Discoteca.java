package discoteca;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FileNotFoundException;
import java.io.IOException;

// La discoteca es el fichero que comparten los lectores y los escritores.
// Varios lectores pueden leer a la vez. Un escritor escribe solo, sin lectores.
public class Discoteca {

    // File representa un fichero del disco.
    private final File fichero;
    private int lectores = 0;
    private int escritores = 0;

    // new FileWriter(fichero) sin el segundo argumento crea el fichero vacío (o lo vacía si ya existía).
    // close() lo cierra. Así cada ejecución empieza desde cero y los lectores nunca buscan un fichero que no existe.
    public Discoteca(String nombreFichero) throws IOException {
        this.fichero = new File(nombreFichero);
        new FileWriter(fichero).close();
    }

    // Devuelve el fichero abierto para leer. El lector lo recorre fuera del método, para no bloquear a los demás.
    public synchronized BufferedReader leer() throws InterruptedException, FileNotFoundException {
        // Al lector solo le molesta un escritor.
        while (escritores > 0) {
            System.out.println(Thread.currentThread().getName() + " no puedo leer. Esperando");
            wait();
        }
        lectores++;
        System.out.println(Thread.currentThread().getName() + " entro a leer. Lectores activos: " + lectores);
        return new BufferedReader(new FileReader(fichero));
    }

    public synchronized void terminaLeer() {
        lectores--;
        System.out.println(Thread.currentThread().getName() + " termino de leer. Lectores activos: " + lectores);
        // Si ya no quedan lectores, puede entrar un escritor.
        if (lectores == 0) {
            notifyAll();
        }
    }

    // Devuelve el fichero abierto para escribir. El segundo argumento true añade al final en vez de borrar.
    public synchronized BufferedWriter escribir() throws InterruptedException, IOException {
        // Al escritor le molesta cualquiera: lectores o escritores.
        while (lectores > 0 || escritores > 0) {
            System.out.println(Thread.currentThread().getName() + " no puedo escribir. Esperando");
            wait();
        }
        System.out.println(Thread.currentThread().getName() + " entro a escribir.");
        escritores++;
        return new BufferedWriter(new FileWriter(fichero, true));
    }

    public synchronized void terminaEscribir() {
        System.out.println(Thread.currentThread().getName() + ": He terminado de escribir");
        escritores--;
        // Pueden entrar lectores y escritores: se avisa a todos.
        notifyAll();
    }
}
