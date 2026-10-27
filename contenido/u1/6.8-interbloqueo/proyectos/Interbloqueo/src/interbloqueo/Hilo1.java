package interbloqueo;

// El hilo 1 empieza por el fichero A.
public class Hilo1 implements Runnable {

    private FicheroA a;
    private FicheroB b;

    public Hilo1(FicheroA a, FicheroB b) {
        this.a = a;
        this.b = b;
    }

    @Override
    public void run() {
        a.metodoA(b);
    }
}
