import DB from '@utils/DBHandler';
import { createSettings, getSettings, deleteSettings } from '@src/settings';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM GuildSettings');
});
afterEach(async () => {
  await DB.execute('DELETE FROM GuildSettings');
});
afterAll(() => DB.close());

describe('Create settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
  });
  test('No settings', async () => {
    await expect(createSettings(1, {})).rejects.toThrow();
  });
  test('Guild already exist', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(createSettings(1, {})).rejects.toThrow();
  });
});
describe('Get settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(getSettings(1)).resolves.not.toThrow();
    expect(await getSettings(1)).toStrictEqual({ setting1: true });
  });
  test('Guild ID does not exist', async () => {
    await expect(getSettings(1)).rejects.toThrow();
  });
});
describe('Delete settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(deleteSettings(1)).resolves.not.toThrow();
    await expect(getSettings(1)).rejects.toThrow();
  });
  test('Guild ID does not exist', async () => {
    await expect(deleteSettings(1)).rejects.toThrow();
  });
});
