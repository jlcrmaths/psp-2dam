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
                    hornear();
                }
            }
            // Al cerrar: se lleva lo que queda y hornea un último lote para el día siguiente.
            panaderia.llevarseBarras();
            hornear();
        } catch (InterruptedException e) {
        }
    }

    // Un método propio dentro de la clase evita repetir las mismas líneas dos veces.
    private void hornear() throws InterruptedException {
        System.out.println("Panadero horneando 20 barras...");
        // Se hornea fuera de synchronized: durante esos 20 segundos los clientes pueden seguir comprando.
        Thread.sleep(20000);
        panaderia.reponer(20);
    }
}
