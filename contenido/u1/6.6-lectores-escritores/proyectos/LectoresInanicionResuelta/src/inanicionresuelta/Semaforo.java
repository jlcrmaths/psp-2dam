package inanicionresuelta;

// El semáforo de antes, con una cosa más: cuenta los escritores que esperan y, mientras haya alguno, los lectores nuevos no entran.
public class Semaforo {

    public static final int LIBRE = 0;
    public static final int CON_LECTORES = 1;
    public static final int CON_ESCRITOR = 2;

    private int estado = LIBRE;
    private int tLectores = 0;
    // Cuántos escritores están esperando su turno.
    private int escritoresEsperando = 0;

    private String info() {
        return "BD:" + estado + " " + tLectores + "L ";
    }

    // Con escritores esperando, el lector también espera, aunque los datos tengan lectores dentro.
    public synchronized void accesoLeer() {
        String nombre = Thread.currentThread().getName();
        while (estado == CON_ESCRITOR || escritoresEsperando > 0) {
            System.out.println(info() + nombre + " trata de leer. ESPERA");
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        System.out.println(info() + nombre + " entra a leer.");
        estado = CON_LECTORES;
        tLectores++;
    }

    public synchronized void accesoEscribir() {
        String nombre = Thread.currentThread().getName();
        // El escritor se apunta como "esperando" antes de esperar y se borra cuando entra.
        escritoresEsperando++;
        while (estado != LIBRE) {
            System.out.println(info() + nombre + " trata de escribir. ESPERA");
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        escritoresEsperando--;
        System.out.println(info() + nombre + " entra a escribir.");
        estado = CON_ESCRITOR;
        System.out.println(info() + nombre + " Escribiendo..");
    }

    // Ahora hay que despertar a todos: si despertara a un lector, este vería que hay un escritor esperando y se volvería a dormir.
    public synchronized void escrituraFinalizada() {
        estado = LIBRE;
        System.out.println(Thread.currentThread().getName() + ": Ya ha escrito");
        notifyAll();
    }

    public synchronized void lecturaFinalizada() {
        tLectores--;
        if (tLectores == 0) {
            estado = LIBRE;
            notifyAll();
        }
    }
}
