import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/settings';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM GuildSettings');
});
afterEach(async () => {
  await DB.execute('DELETE FROM GuildSettings');
});
afterAll(() => DB.close());

describe('POST', () => {
  test('Valid', () => {
    const request = http('POST', `${ROUTE}/1`, undefined, { setting1: true });
    expect(request.statusCode).toStrictEqual(200);
    const response = JSON.parse(String(request.getBody() as string));
    expect(response).toStrictEqual({});
  });
  test('Invalid (No Settings)', () => {
    const request = http('POST', `${ROUTE}/1`, undefined, {});
    expect(request.statusCode).toStrictEqual(400);
  });
  test('Invalid (Already exists)', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(200);
    // See if duplicate will return HTTP 409
    const request = http('POST', `${ROUTE}/1`, undefined, { setting1: true });
    expect(request.statusCode).toStrictEqual(409);
  });
});

describe('GET', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(200);
    // We expect to fetch it with no issues
    const request = http('GET', `${ROUTE}/1`);
    expect(request.statusCode).toStrictEqual(200);
    const response = JSON.parse(String(request.getBody() as string));
    expect(response).toStrictEqual({ setting1: true });
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('GET', `${ROUTE}/1`).statusCode).toStrictEqual(404);
  });
});

describe('PUT', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(200);
    // We expect to be able to update it with no issues
    const REQ = http('PUT', `${ROUTE}/1`, undefined, { setting1: false });
    expect(REQ.statusCode).toStrictEqual(200);
    expect(JSON.parse(REQ.getBody() as string)).toStrictEqual({ setting1: false });
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('PUT', `${ROUTE}/1`, undefined, {}).statusCode).toStrictEqual(404);
  });
});

describe('PATCH', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(200);
    // We expect to be able to update it with no issues
    const REQ = http('PATCH', `${ROUTE}/1`, undefined, { setting1: false });
    expect(REQ.statusCode).toStrictEqual(200);
    expect(JSON.parse(REQ.getBody() as string)).toStrictEqual({ setting1: false });
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('PATCH', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(404);
  });
  test('Invalid (No settings provided)', () => {
    expect(http('PATCH', `${ROUTE}/1`, undefined, {}).statusCode).toStrictEqual(400);
  });
});

describe('DELETE', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(200);
    // We expect to fetch it with no issues
    const request = http('DELETE', `${ROUTE}/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('DELETE', `${ROUTE}/1`).statusCode).toStrictEqual(404);
  });
});
