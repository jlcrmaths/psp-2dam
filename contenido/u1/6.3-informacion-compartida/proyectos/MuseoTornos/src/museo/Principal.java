package museo;

public class Principal {

    public static void main(String[] args) {
        Museo museo = new Museo();

        for (int i = 1; i <= 4; i++) {
            new Thread(new Torno(museo), "Torno " + i).start();
        }
    }
}
