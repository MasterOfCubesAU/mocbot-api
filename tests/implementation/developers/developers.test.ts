import { getDevelopers } from '@src/developers';
import DB from '@utils/DBHandler';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM Developers');
});
afterAll(() => DB.close());

describe('Get Developer Data', () => {
  test('Valid', async () => {
    await DB.execute('INSERT INTO Developers VALUES (1), (2)');
    expect(await getDevelopers()).toStrictEqual(['1', '2']);
  });
});
