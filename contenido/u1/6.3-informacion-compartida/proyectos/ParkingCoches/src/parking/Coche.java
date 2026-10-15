package parking;

// Un coche: entra en el parking, aparca 2 segundos y sale. Lo repite 3 veces.

import static java.lang.Thread.sleep;

public class Coche implements Runnable {

    private Parking parking;

    public Coche(Parking parking) {
        this.parking = parking;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            parking.entrar();
            try {
                sleep(2000);
            } catch (InterruptedException ex) {
                System.getLogger(Coche.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
            }
            parking.salir();
        }
    }
}
