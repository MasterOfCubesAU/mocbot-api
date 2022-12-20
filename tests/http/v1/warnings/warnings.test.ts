import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/warnings';

beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterEach(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterAll(() => DB.close());

describe('Create Warning (User)', () => {
  test('Valid', async () => {
    // Get time now to compare later
    const timeNow = Date.now();
    // Create a valid user
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    const request = http('POST', `${ROUTE}/1/1`, undefined, { reason: 'Test Reason', adminID: 2 });
    expect(request.statusCode).toStrictEqual(200);
    const response = JSON.parse(String(request.getBody() as string));
    expect(response).toStrictEqual({
      WarningID: expect.any(String),
      UserGuildID: expect.any(Number),
      Reason: 'Test Reason',
      Time: expect.any(Number),
      AdminID: 2,
    });

    expect(response.Time).toBeLessThanOrEqual(timeNow + 1000);
  });
  test('Invalid (Reason missing)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    expect(http('POST', `${ROUTE}/1/1`, undefined, { adminID: 2 }).statusCode).toStrictEqual(400);
  });
  test('Invalid (Admin ID missing)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    expect(http('POST', `${ROUTE}/1/1`, undefined, { reason: 'Test Reason' }).statusCode).toStrictEqual(400);
  });
});
