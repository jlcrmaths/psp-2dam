package interbloqueo;

// El fichero B: igual que A, pero al revés. Entra en B y después intenta entrar en A.
public class FicheroB {

    public synchronized void metodoB(FicheroA a) {
        String nombre = Thread.currentThread().getName();
        System.out.println(nombre + " entra en fichero_B");

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }

        System.out.println(nombre + " intentando entrar en fichero_A");
        a.metodoA(this);
    }
}
