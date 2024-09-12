import { describe, test, expect } from "@jest/globals";
import app from "../src/server.js";
import { esPalindromo } from "../src/palindromo.js";
import { esPrimo } from "../src/numeros.js"
import request from "supertest";
import { configuration } from "../src/config.js";

describe("Test Suite App", () => {

    test("palindromo",()=>{
        let frase: any = "ala";
        expect(esPalindromo(frase)).toBe(true);

        frase = "cama";
        expect(esPalindromo(frase)).toBe(false);

        frase = "57";
        expect(esPalindromo(frase)).toBe(false);

    });

    test("primo",()=>{
        let number: any = 0;
        expect(esPrimo(number)).toBe(false);

        number = 1;
        expect(esPrimo(number)).toBe(false);

        number = 6;
        expect(esPrimo(number)).toBe(false);

        number = 13;
        expect(esPrimo(number)).toBe(true);

        number = "cinco";
        expect(esPrimo(number)).toBeNaN;
    });

    test("test de endpoint /", async () => {
        return await request(app)
            .get("/")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username} y se ejecuta en el puerto ${configuration.port}`);
            })
    });

    test("endpoint key", async () => {
        return await request(app)
        .get("/key")
        .expect("Content-Type", /text/)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe(`Hola, esta api contiene la siguiente api-key: ${configuration.apiKey}`);
        })
    });

    test("endpoint /palindromo frase es palindromo", async () => {
        return await request(app)
        .get("/palindromo/ala")
        .expect("Content-Type", /text/)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe(`Hola, La frase ingresada es palindromo`);
        })
    });

    test("endpoint /palindromo frase no es palindromo", async () => {
        return await request(app)
        .get("/palindromo/cama")
        .expect("Content-Type", /text/)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe(`Hola, La frase ingresada no es palindromo`);
        })
    });

    test("endpoint /primo no es un numero", async () => {
        return await request(app)
        .get("/primo/cinco")
        .expect("Content-Type", /text/)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe(`Hola, el valor ingresado no corresponde a un numero`);
        })
    });

    
    test("endpoint /primo es primo", async () => {
        return await request(app)
        .get("/primo/13")
        .expect("Content-Type", /text/)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe(`Hola, el numero ingresado es un numero primo`);
        })
    });

    test("endpoint /primo no es primo", async () => {
        return await request(app)
        .get("/primo/6")
        .expect("Content-Type", /text/)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe(`Hola, el numero ingresado no es un numero primo`);
        })
    });


});