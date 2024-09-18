export const esPrimo = (numero: number) => {
    let validarNumero = Number(numero);
    if(isNaN(validarNumero)){
        throw new Error("El valor ingresado no corresponde a un número");
    }
    if (numero < 2) {
        return false;
    }
    for (let i = 2; i < numero; i++) {
        if (numero % i === 0) {
            return false;
        }
    }
    return true;
}