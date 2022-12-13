import { http } from "../../utils"

const ROUTE = "/v1/settings"

describe(`POST`, () => {
    test('Valid', () => {
        const request = http('POST', `${ROUTE}/231230403053092864`, undefined);
        const response = JSON.parse(String(request.getBody() as string));
        expect(response).toStrictEqual({});
    });
});
describe(`GET`, () => {
    test('Valid', () => {
        const request = http('GET', `${ROUTE}/231230403053092864`, undefined);
        const response = JSON.parse(String(request.getBody() as string));
        expect(response).toStrictEqual({});
    });
});
describe(`PATCH`, () => {
    test('Valid', () => {
        const request = http('PATCH', `${ROUTE}/231230403053092864`, undefined);
        const response = JSON.parse(String(request.getBody() as string));
        expect(response).toStrictEqual({});
    });
});
