export const esPalindromo = (frase: string) => {
    if(typeof frase != "string"){
        throw new Error("El valor ingresado no corresponde a una cadena de texto");
    }else{
        if(frase == ""){
            throw new Error("El texto ingresado esta vacio");
        }else{
            const fraseSinEspacios = frase.replace(/\s/g, "").toLowerCase();
            const fraseInvertida = fraseSinEspacios.split("").reverse().join("");
            return fraseSinEspacios === fraseInvertida;
        }
    }
}