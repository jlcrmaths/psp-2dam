package museo;

// Un torno de entrada: realiza 20 accesos al museo.
public class Torno implements Runnable {

    private Museo museo;

    public Torno(Museo museo) {
        this.museo = museo;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 20; i++) {
            museo.accede();
        }
    }
}
