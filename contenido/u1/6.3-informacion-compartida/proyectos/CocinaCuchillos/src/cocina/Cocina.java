package cocina;

// La cocina es el recurso compartido: guarda cuántos cuchillos quedan libres.
public class Cocina {

    private int libres;

    public Cocina(int cuchillos) {
        libres = cuchillos;
    }

    // synchronized: solo un cocinero a la vez cambia la cuenta de cuchillos libres.
    public synchronized void coger() {
        while(libres == 0) {
            try {
                wait();
            } catch (InterruptedException ex) {
                System.getLogger(Cocina.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
            }
        }
        libres--;
        System.out.println(Thread.currentThread().getName() + " coge un cuchillo. Libres: " + libres);
    }

    public synchronized void soltar() {
        libres++;
        notifyAll();
        System.out.println(Thread.currentThread().getName() + " suelta el cuchillo. Libres: " + libres);
    }
}
