import DB from '@utils/DBHandler';
import { createWarning } from '@src/warnings';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterEach(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterAll(() => DB.close());

describe('Create Warning', () => {
  test('Valid', async () => {
    await expect(createWarning(1, 1, 'Test Reason', 2)).resolves.not.toThrow();
  });
  test('Invalid (Reason empty)', async () => {
    await expect(createWarning(1, 1, '', 2)).rejects.toThrow();
  });
  test('Invalid (AdminID empty)', async () => {
    await expect(createWarning(1, 1, 'Test Reason', null)).rejects.toThrow();
  });
});
