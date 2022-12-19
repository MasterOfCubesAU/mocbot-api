import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/xp';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
  await DB.execute('INSERT INTO UserInGuilds values (1, 123, 789)');
  await DB.execute('INSERT INTO UserInGuilds values (2, 124, 789)');
  await DB.execute('INSERT INTO UserInGuilds values (3, 123, 790)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (1, 23, 7777)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (2, 1, 3)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (3, 123, 33214)');
});

afterAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
  DB.close();
});

describe('Guild XP Data', () => {
  test('Valid response', async () => {
    const request = http('GET', `${ROUTE}/789`, undefined);
    expect(request.statusCode).toStrictEqual(200);
  });

  test('Invalid response', () => {
    const request = http('GET', `${ROUTE}/120`, undefined);
    expect(request.statusCode).toStrictEqual(404);
  });
});
