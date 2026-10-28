package sincronizacion;

// El panadero: cada segundo mira si quedan menos de 10 barras y, si es así, hornea 20 más (20 segundos).
public class Panadero implements Runnable {

    private Mostrador mostrador;

    public Panadero(Mostrador mostrador) {
        this.mostrador = mostrador;
    }

    @Override
    public void run() {
        while (!mostrador.estaCerrando()) {
            dormir(1000);
            if (!mostrador.estaCerrando() && mostrador.hacenFalta()) {
                hornear();
            }
        }
        // Al cerrar: se lleva lo que queda y hornea un último lote para el día siguiente.
        mostrador.vaciar();
        hornear();
    }

    // Un método propio dentro de la clase evita repetir las mismas líneas dos veces.
    private void hornear() {
        System.out.println("Panadero horneando 20 barras...");
        // Se hornea fuera de synchronized: durante esos 20 segundos los clientes pueden seguir comprando.
        dormir(20000);
        mostrador.reponer(20);
    }

    // Agrupa el try/catch de sleep en un solo sitio.
    private void dormir(int milisegundos) {
        try {
            Thread.sleep(milisegundos);
        } catch (InterruptedException e) {
        }
    }
}
