package jardines;

// Una persona que entra al jardín: suma 1 a la cuenta.
public class EntraJardin implements Runnable {

    private RecursoJardin jardin;

    public EntraJardin(RecursoJardin jardin) {
        this.jardin = jardin;
    }

    @Override
    public void run() {
        jardin.incrementaCuenta();
    }
}
