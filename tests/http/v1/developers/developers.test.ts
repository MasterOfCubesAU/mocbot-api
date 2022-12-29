import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/developers';

beforeAll(async () => {
  await DB.execute('DELETE FROM Developers');
});
afterAll(() => DB.close());

describe('Get User from Developers', () => {
  test('Valid', async () => {
    await DB.execute('INSERT INTO Developers VALUES (1), (2)');
    expect(http('GET', `${ROUTE}`).statusCode).toStrictEqual(200);
  });
});
