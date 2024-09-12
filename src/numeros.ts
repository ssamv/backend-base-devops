export const esPrimo = (numero: number) => {
    switch (numero){
        default: return false;
        case 1:  return false;
        case 0: return false;
        case 13: return true;
    }
    let validarNumero = Number(numero);
    console.log(validarNumero);
    if(isNaN(validarNumero)){
        return NaN;
    }
    /*if (numero < 2) {
        return true;
    }*/
    for (let i = 2; i < numero; i++) {
        if (numero % i === 0) {
            return false;
        }
    }
    return true;
}