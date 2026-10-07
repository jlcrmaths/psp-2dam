package crearhilos;

// Este hilo suma los números de un array. run() no recibe nada de fuera,
// así que el array tiene que entrar por otro sitio: el constructor.
public class HiloSuma implements Runnable {

    // private significa que solo esta clase puede usar este atributo.
    // int[] es un array de números enteros: una fila de casillas con un entero en cada una.
    private int[] numeros;

    // El constructor es un método especial que se ejecuta al hacer new HiloSuma(...).
    // Se llama igual que la clase y no lleva void. Aquí recibe el array con el que va a trabajar.
    public HiloSuma(int[] numeros) {
        // this.numeros es el atributo de la clase; numeros a secas es el parámetro que llega.
        // Se llaman igual, así que this sirve para distinguirlos. Aquí se copia el parámetro al atributo.
        this.numeros = numeros;
    }

    @Override
    public void run() {
        // La suma empieza en 0 porque sumar 0 no cambia el resultado.
        int total = 0;
        // numeros.length es cuántos elementos tiene el array. numeros[i] es el elemento de la posición i.
        for (int i = 0; i < numeros.length; i++) {
            total = total + numeros[i];
        }
        System.out.println(Thread.currentThread().getName() + ": suma = " + total);
    }
}
