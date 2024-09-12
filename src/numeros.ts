export const esPrimo = (numero: number) => {
    let validarNumero = Number(numero);
    console.log(validarNumero);
    if(isNaN(validarNumero)){
        return NaN;
    }
    if (numero < 2) {
        return true;
    }
    for (let i = 2; i < numero; i++) {
        if (numero % i === 0) {
            return false;
        }
    }
    return true;
}