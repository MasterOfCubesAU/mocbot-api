import DB from '@utils/DBHandler';
import { fetchGuildXP } from '@src/xp';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
  await DB.execute('INSERT INTO UserInGuilds values (1, 123, 789)');
  await DB.execute('INSERT INTO UserInGuilds values (2, 124, 789)');
  await DB.execute('INSERT INTO UserInGuilds values (3, 123, 790)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (1, 7777, 23)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (2, 3, 1)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (3, 33214, 123)');
});

afterAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
  DB.close();
});

describe('Fetching Guild XP data', () => {
  test('Invalid Guild ID', async () => {
    await expect(fetchGuildXP('1')).rejects.toThrow();
  });
  test('Valid Guild ID', async () => {
    await expect(fetchGuildXP('789')).resolves.not.toThrow();
    expect(await fetchGuildXP('789')).toEqual(expect.arrayContaining([expect.objectContaining({ UserGuildID: 1, XP: 7777, Level: 23 }), expect.objectContaining({ UserGuildID: 2, XP: 3, Level: 1 })]));
  });
});
