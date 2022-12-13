import DB from "../../../src/utils/DBHandler";

describe("Establish connection to DB", () => {
    test('Valid connection', () => {

        const VARS = [
            process.env.DB_HOST,
            process.env.DB_USER,
            process.env.DB_PASS,
            process.env.DB_NAME
        ]

        VARS.forEach(element => {
            expect(element).not.toStrictEqual(undefined);
        });
        expect(() => { DB.connect() }).not.toThrow();
    });
});