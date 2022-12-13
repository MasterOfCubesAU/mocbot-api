import { http } from "../../utils"

const ROUTE = "/v1/warnings"

describe("Read Warning Data (Guild)", () => {
    describe(`GET`, () => {
        test('Valid', () => {
            const request = http('GET', `${ROUTE}/231230403053092864`, undefined);
            const response = JSON.parse(String(request.getBody() as string));
            expect(response).toStrictEqual({});
        });
    });
});
describe("Read Warning Data (User)", () => {
    describe(`GET`, () => {
        test('Valid', () => {
            const request = http('GET', `${ROUTE}/231230403053092864/169402073404669952`, undefined);
            const response = JSON.parse(String(request.getBody() as string));
            expect(response).toStrictEqual({});
        });
    });
});
describe("Delete Warning", () => {
    describe(`DELETE`, () => {
        test('Valid', () => {
            const request = http('DELETE', `${ROUTE}/this_is_a_random_ID`, undefined);
            const response = JSON.parse(String(request.getBody() as string));
            expect(response).toStrictEqual({});
        });
    });
});
