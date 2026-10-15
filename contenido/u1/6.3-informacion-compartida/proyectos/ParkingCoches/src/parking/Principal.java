package parking;

public class Principal {

    public static void main(String[] args) {
        Parking parking = new Parking(3);

        for (int i = 1; i <= 8; i++) {
            new Thread(new Coche(parking), "Coche " + i).start();
        }
    }
}
