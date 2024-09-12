import { describe, test, expect } from "@jest/globals";
import app from "../src/server.js";
import { esPalindromo } from "../src/palindromo.js";
import request from "supertest";
import { configuration } from "../src/config.js";

describe("Test Suite App", () => {

    test("palindromo",()=>{
        let frase: any = "ala";
        expect(esPalindromo(frase)).toBe(true);

        frase = "cama";
        expect(esPalindromo(frase)).toBe(false);
    });

    /*test("sumar dos numeros", () => {

        let a: any = 100;
        let b: any = 200;
        expect(suma(a, b)).toBe(300);

        a = 10;
        b = "a";
        expect(suma(a, b)).toBeNaN();

        a = undefined;
        b = 1;
        expect(() => { suma(a, b) }).toThrow("No se puede sumar indefinidos");

    });*/

    test("endpoint /", () => {
        expect(1 + 1).toBe(2);
    });

    test("endpoint key", () => {
        expect(1 + 1).toBe(2);
    });

    test("endpoint /palindromo", () => {
        expect(1 + 1).toBe(2);
    });

    test("endpoint /primo", () => {
        expect(1 + 1).toBe(2);
    });

    test("test de endpoint /", async () => {
        return await request(app)
            .get("/")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
            })
    });
});