import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/xp';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeEach(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
  await DB.execute('INSERT INTO UserInGuilds values (1, 123, 789), (2, 124, 789), (3, 123, 790)');
  await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) values (1, 7777, 23), (2, 3, 1), (3, 33214, 123)');
});

afterAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
  DB.close();
});

describe('Guild XP Data', () => {
  test('Valid response', () => {
    const request = http('GET', `${ROUTE}/789`);
    expect(request.statusCode).toStrictEqual(200);
  });

  test('Invalid response (invalid guildId)', () => {
    const request = http('GET', `${ROUTE}/120`);
    expect(request.statusCode).toStrictEqual(404);
  });
});

describe('Delete Guild XP Data', () => {
  test('Valid response', () => {
    const request = http('DELETE', `${ROUTE}/789`);
    expect(request.statusCode).toStrictEqual(200);
  });

  test('Invalid response (invalid guildId)', () => {
    const request = http('DELETE', `${ROUTE}/120`);
    expect(request.statusCode).toStrictEqual(404);
  });
});

describe('Get User XP Data', () => {
  test('Valid response', () => {
    const request = http('GET', `${ROUTE}/789/123`);
    expect(request.statusCode).toStrictEqual(200);
  });

  test('Invalid response (invalid guildId)', () => {
    const request = http('GET', `${ROUTE}/120/123`);
    expect(request.statusCode).toStrictEqual(404);
  });

  test('Invalid response (invalid userId)', () => {
    const request = http('GET', `${ROUTE}/789/125`);
    expect(request.statusCode).toStrictEqual(404);
  });

  test('Invalid response (invalid userId/guildId combo)', () => {
    const request = http('GET', `${ROUTE}/790/124`);
    expect(request.statusCode).toStrictEqual(404);
  });
});

describe('Post User XP Data', () => {
  test('Successfully created new user XP data', () => {
    expect(http('POST', `${ROUTE}/1/1`).statusCode).toStrictEqual(200);
    expect(http('GET', `${ROUTE}/1/1`).statusCode).toStrictEqual(200);
    // should fail when called again on same user in same guild
    expect(http('POST', `${ROUTE}/1/1`).statusCode).toStrictEqual(409);
  });

  test('Testing optional parameters passed in', () => {
    expect(http('POST', `${ROUTE}/1/1`, { XP: 333, Level: 11 }).statusCode).toStrictEqual(200);
    expect(http('GET', `${ROUTE}/1/1`).statusCode).toStrictEqual(200);
  });
});

describe('Update User XP Data', () => {
  test('Invalid UserGuildID provided', () => {
    const request = http('PATCH', `${ROUTE}/1/1`, { XP: 333, Level: 11 });
    expect(request.statusCode).toStrictEqual(404);
  });

  test('No settings provided', () => {
    const request = http('PATCH', `${ROUTE}/789/124`, {});
    expect(request.statusCode).toStrictEqual(400);
  });

  test('Successfully updated user XP data', () => {
    expect(http('PATCH', `${ROUTE}/789/124`, { XP: 333, Level: 11 }).statusCode).toStrictEqual(200);
  });
});

describe('Delete user XP Data', () => {
  test('Valid response', () => {
    const request = http('DELETE', `${ROUTE}/789/123`);
    expect(request.statusCode).toStrictEqual(200);
  });

  test('Invalid response (invalid guildId/userId)', () => {
    const request = http('DELETE', `${ROUTE}/790/124`);
    expect(request.statusCode).toStrictEqual(404);
  });
});

describe('Replacing user XP Data', () => {
  const newTime = Math.floor(Date.now() / 1000);
  test('Invalid UserGuildID provided', () => {
    const request = http('PUT', `${ROUTE}/1/1`, { XP: 333, Level: 11, XPLock: newTime, VoiceChannelXPLock: newTime });
    expect(request.statusCode).toStrictEqual(404);
  });

  test('No XP data provided/missing data', () => {
    const request = http('PUT', `${ROUTE}/789/124`, { XP: 333, Level: 11, XPLock: newTime });
    expect(request.statusCode).toStrictEqual(400);
  });

  test('Successfully replaced user XP data', () => {
    expect(http('PUT', `${ROUTE}/789/124`, { XP: 333, Level: 11, XPLock: newTime, VoiceChannelXPLock: newTime }).statusCode).toStrictEqual(200);
  });
});
