package sincronizacion;

// El panadero: cada segundo mira si quedan menos de 10 barras y, si es así, hornea 20 más (20 segundos).
public class Panadero implements Runnable {

    private final Panaderia panaderia;

    public Panadero(Panaderia panaderia) {
        this.panaderia = panaderia;
    }

    @Override
    public void run() {
        try {
            while (panaderia.estaAbierta()) {
                Thread.sleep(1000);
                if (panaderia.estaAbierta() && panaderia.hacenFaltaBarras()) {
                    panaderia.hornear();
                }
            }
            // Al cerrar: se lleva lo que queda y hornea un último lote para el día siguiente.
            panaderia.llevarseBarras();
            panaderia.hornear();
        } catch (InterruptedException e) {
        }
    }
}
