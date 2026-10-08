package sincronizacion;

import java.util.Random;

// Un cliente: espera una lavadora, lava entre 5 y 10 segundos y se va.
public class Cliente implements Runnable {

    private Lavanderia lavanderia;

    public Cliente(Lavanderia lavanderia) {
        this.lavanderia = lavanderia;
    }

    @Override
    public void run() {
        Random azar = new Random();
        lavanderia.entrar();
        // El lavado se hace con la lavadora ya cogida, pero fuera de synchronized:
        // si no, los demás clientes no podrían ni mirar si hay sitio.
        try {
            Thread.sleep((5 + azar.nextInt(6)) * 1000);
        } catch (InterruptedException e) {
        }
        lavanderia.salir();
    }
}
