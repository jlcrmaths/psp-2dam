package leerescribir3;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

// El fichero compartido, ahora de verdad: guarda el nombre del fichero del disco y entrega el fichero abierto a quien tiene permiso.
public class Fichero {

    // File representa un fichero del disco. Tiene el nombre, pero todavía no lo abre.
    private final File fichero;
    private int lectores = 0;
    private int escritores = 0;

    // new FileWriter(fichero) sin más crea el fichero vacío (o lo vacía si ya existía). close() lo cierra.
    // Así cada ejecución empieza desde cero y los lectores nunca buscan un fichero que no existe.
    public Fichero(String nombre) throws IOException {
        this.fichero = new File(nombre);
        new FileWriter(fichero).close();
    }

    // Ahora no es void: devuelve el fichero abierto para leer. El lector lo recorre fuera del método, para no bloquear a los demás.
    public synchronized BufferedReader leerFichero() throws InterruptedException, FileNotFoundException {
        while (escritores > 0) {
            System.out.println(Thread.currentThread().getName() + ": Hay un escritor. Espero.");
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
        if (lectores == 0) {
            notifyAll();
        }
    }

    public synchronized void terminaEscribir() {
        escritores--;
        System.out.println(Thread.currentThread().getName() + ": He terminado de escribir");
        notifyAll();
    }
}
