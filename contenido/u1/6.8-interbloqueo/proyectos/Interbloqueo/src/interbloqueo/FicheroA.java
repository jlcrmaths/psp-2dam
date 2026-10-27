package interbloqueo;

// El fichero A. Solo un hilo a la vez puede estar dentro de sus métodos synchronized.
public class FicheroA {

    // Entra en A (coge su cerrojo), espera un segundo y después intenta entrar en B.
    // Se queda con el cerrojo de A mientras pide el de B.
    public synchronized void metodoA(FicheroB b) {
        String nombre = Thread.currentThread().getName();
        System.out.println(nombre + " entra en fichero_A");

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }

        System.out.println(nombre + " intentando acceder a fichero_B");
        // this es el propio FicheroA: se le pasa a B para que B pueda volver a llamar a A.
        b.metodoB(this);
    }
}
