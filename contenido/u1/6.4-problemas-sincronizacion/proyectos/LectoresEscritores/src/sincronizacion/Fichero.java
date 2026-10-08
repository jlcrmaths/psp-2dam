package sincronizacion;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

// El fichero de texto que comparten lectores y escritores.
// Todo el acceso pasa por esta clase para poder sincronizarlo.
public class Fichero {

    private String ruta;

    public Fichero(String ruta) {
        this.ruta = ruta;
        // FileWriter abre el fichero para escribir. Sin el segundo argumento, lo vacía si ya existía.
        // Así cada ejecución empieza con el fichero vacío.
        // IOException es el error que Java lanza cuando algo falla al usar un fichero (no existe, no hay permiso...).
        // Con ficheros el try/catch es obligatorio, igual que con wait().
        try {
            FileWriter fw = new FileWriter(ruta);
            fw.close();
        } catch (IOException e) {
            System.out.println("No se puede crear el fichero " + ruta);
        }
    }

    // synchronized: mientras un escritor está escribiendo, nadie más (lector o escritor) puede entrar.
    // Si dos hilos escribieran a la vez, las líneas podrían mezclarse.
    public synchronized void escribir(String nombre) {
        try {
            // El segundo argumento true significa "añadir al final" en vez de borrar lo que había.
            FileWriter fw = new FileWriter(ruta, true);
            // \n es el salto de línea: cada nombre queda en una línea nueva.
            fw.write(nombre + "\n");
            // close() cierra el fichero y guarda lo escrito.
            fw.close();
            System.out.println(nombre + " ha escrito su nombre");
        } catch (IOException e) {
            System.out.println(nombre + " no ha podido escribir");
        }
    }

    // También es synchronized: así un lector nunca lee a mitad de una escritura.
    public synchronized void contarLineas(String nombre) {
        try {
            // Files.readAllLines lee el fichero entero y devuelve una lista con una entrada por línea.
            // size() dice cuántas hay.
            int lineas = Files.readAllLines(Path.of(ruta)).size();
            System.out.println(nombre + " lee: el fichero tiene " + lineas + " líneas");
        } catch (IOException e) {
            System.out.println(nombre + " no ha podido leer");
        }
    }
}
