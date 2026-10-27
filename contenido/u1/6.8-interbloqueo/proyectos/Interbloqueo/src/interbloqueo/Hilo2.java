package interbloqueo;

// El hilo 2 empieza por el fichero B: el orden contrario al del hilo 1.
public class Hilo2 implements Runnable {

    private FicheroA a;
    private FicheroB b;

    public Hilo2(FicheroA a, FicheroB b) {
        this.a = a;
        this.b = b;
    }

    @Override
    public void run() {
        b.metodoB(a);
    }
}
