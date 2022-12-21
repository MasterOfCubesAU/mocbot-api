import DB from '@utils/DBHandler';
import { createWarning, getUserWarnings } from '@src/warnings';

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
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(createWarning(1, 1, 'Test Reason', 2)).resolves.not.toThrow();
  });
  test('Invalid (Reason empty)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(createWarning(1, 1, '', 2)).rejects.toThrow();
  });
  test('Invalid (AdminID empty)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(createWarning(1, 1, 'Test Reason', null)).rejects.toThrow();
  });
});

describe('Get Warnings', () => {
  test('Valid (single value)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(createWarning(1, 1, 'Test Reason', 2)).resolves.not.toThrow();
    await expect(getUserWarnings(1, 1)).resolves.not.toThrow();
  });
  test('Valid (multiple values)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(createWarning(1, 1, 'Test Reason', 2)).resolves.not.toThrow();
    await expect(getUserWarnings(1, 1)).resolves.not.toThrow();
  });
  test('Invalid (UserID invalid)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(getUserWarnings(1, 2)).rejects.toThrow();
  });
  test('Invalid (GuildID invalid)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    await expect(getUserWarnings(2, 1)).rejects.toThrow();
  });
});
