import { http } from '../../utils';

const ROUTE = '/v1/xp';

describe('Guild XP Data', () => {
  describe('GET', () => {
    test('Valid', () => {
      const request = http('GET', `${ROUTE}/231230403053092864`, undefined);
      const response = JSON.parse(String(request.getBody() as string));
      expect(response).toStrictEqual({});
    });
  });
});
describe('User XP Data', () => {
  describe('GET', () => {
    test('Valid', () => {
      const request = http('GET', `${ROUTE}/231230403053092864/169402073404669952`, undefined);
      const response = JSON.parse(String(request.getBody() as string));
      expect(response).toStrictEqual({});
    });
  });
});
