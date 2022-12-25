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
    // Create a valid user
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    // Get request time now to compare later
    const request = http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason', adminID: 2 });
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Invalid (Reason missing)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    expect(http('POST', `${ROUTE}/1/1`, { adminID: 2 }).statusCode).toStrictEqual(400);
  });
  test('Invalid (Admin ID missing)', async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    expect(http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason' }).statusCode).toStrictEqual(400);
  });
});

describe('Get Warnings (User)', () => {
  test('Valid (single value)', async () => {
    // Create a valid user
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    // Create a Warning
    const createRequest = http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason (MOCBOT API)', adminID: 2 });
    expect(createRequest.statusCode).toStrictEqual(200);
    // Get Warning
    const request = http('GET', `${ROUTE}/1/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Valid (multiple values)', async () => {
    // Create a valid user
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    // Create warning 1
    const createRequest = http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason 1 (MOCBOT API)', adminID: 2 });
    expect(createRequest.statusCode).toStrictEqual(200);
    // Create warning 2
    const createRequest2 = http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason 2 (MOCBOT API)', adminID: 2 });
    expect(createRequest2.statusCode).toStrictEqual(200);
    // Create warning 2
    const createRequest3 = http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason 3 (MOCBOT API)', adminID: 2 });
    expect(createRequest3.statusCode).toStrictEqual(200);
    // Get Warnings
    const request = http('GET', `${ROUTE}/1/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test("Invalid (User ID doesn't exist)", async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    expect(http('GET', `${ROUTE}/1/2`).statusCode).toStrictEqual(404);
  });
  test("Invalid (Guild ID doesn't exist)", async () => {
    await expect(DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 1])).resolves.not.toThrow();
    expect(http('GET', `${ROUTE}/2/1`).statusCode).toStrictEqual(404);
  });
});

describe('Delete warning', () => {
  test('Valid', () => {
    const request = http('POST', `${ROUTE}/1/1`, { reason: 'Test Reason', adminID: 2 });
    expect(request.statusCode).toStrictEqual(200);
    const warningID = JSON.parse(request.getBody() as string).WarningID;
    expect(http('DELETE', `${ROUTE}/${warningID}`).statusCode).toStrictEqual(200);
  });
  test('Invalid (Warning ID does not exist)', () => {
    expect(http('DELETE', `${ROUTE}/abcde`).statusCode).toStrictEqual(404);
  });
});

describe('Delete guild warnings', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/2/1`, { reason: 'Test Reason', adminID: 2 }).statusCode).toStrictEqual(200);
    const req = http('DELETE', `${ROUTE}/2`);
    expect(req.statusCode).toStrictEqual(200);
  });
  test('Invalid (Warning ID does not exist)', () => {
    expect(http('DELETE', `${ROUTE}/2`).statusCode).toStrictEqual(404);
  });
});

describe('Get guild warnings', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/1/1`, { reason: 'a test reason', adminID: 2 });
    http('POST', `${ROUTE}/1/1`, { reason: 'another test reason', adminID: 2 });
    http('POST', `${ROUTE}/1/1`, { reason: 'the last test reason 3', adminID: 2 });
    const request = http('GET', `${ROUTE}/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Invalid (Guild ID does not exist)', () => {
    expect(http('GET', `${ROUTE}/1`).statusCode).toStrictEqual(404);
  });
});
