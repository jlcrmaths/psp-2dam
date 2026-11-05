package interbloqueo;

// Un fichero con nombre. No hace falta nada más: el cerrojo es el del propio objeto.
public class Fichero {

    private String nombre;

    public Fichero(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
