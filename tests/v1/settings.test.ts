import { http } from "./utils"

const ROUTE = "/v1/settings/231230403053092864"

describe(`POST ${ROUTE}`, () => {
    test('Valid', () => {
        const request = http('POST', ROUTE, undefined);
        const response = JSON.parse(String(request.getBody() as string));
        expect(response).toStrictEqual({});
    });
});
describe(`GET ${ROUTE}`, () => {
    test('Valid', () => {
        const request = http('GET', ROUTE, undefined);
        const response = JSON.parse(String(request.getBody() as string));
        expect(response).toStrictEqual({});
    });
});
describe(`PATCH ${ROUTE}`, () => {
    test('Valid', () => {
        const request = http('PATCH', ROUTE, undefined);
        const response = JSON.parse(String(request.getBody() as string));
        expect(response).toStrictEqual({});
    });
});
