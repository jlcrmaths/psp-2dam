package jardines;

// Una persona que sale del jardín: resta 1 a la cuenta.
public class SaleJardin implements Runnable {

    private RecursoJardin jardin;

    public SaleJardin(RecursoJardin jardin) {
        this.jardin = jardin;
    }

    @Override
    public void run() {
        jardin.decrementaCuenta();
    }
}
