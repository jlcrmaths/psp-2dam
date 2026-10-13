package cocina;

public class Principal {

    public static void main(String[] args) {
        Cocina cocina = new Cocina(5);

        for (int i = 1; i <= 3; i++) {
            new Thread(new Cocinero(cocina), "Cocinero " + i).start();
        }
    }
}
