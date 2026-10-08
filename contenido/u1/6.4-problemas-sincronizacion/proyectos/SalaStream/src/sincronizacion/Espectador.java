package sincronizacion;

import java.util.Random;

// Un espectador: llega en un momento cualquiera, espera a que haya partida, la ve entera y se va.
public class Espectador implements Runnable {

    private Sala sala;

    public Espectador(Sala sala) {
        this.sala = sala;
    }

    @Override
    public void run() {
        Random azar = new Random();
        try {
            Thread.sleep(azar.nextInt(10) * 1000);
        } catch (InterruptedException e) {
        }
        int partida = sala.entrarEspectador();
        if (partida > 0) {
            sala.ver(partida);
        } else {
            System.out.println(Thread.currentThread().getName() + " se va: ya no hay más partidas");
        }
    }
}
