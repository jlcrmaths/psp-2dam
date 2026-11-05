package interbloqueo;

// Un fichero con nombre y con un número. El número marca el orden en que se piden los ficheros.
public class Fichero {

    private String nombre;
    private int numero;

    public Fichero(String nombre, int numero) {
        this.nombre = nombre;
        this.numero = numero;
    }

    public String getNombre() {
        return nombre;
    }

    public int getNumero() {
        return numero;
    }
}
