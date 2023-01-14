import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/roles';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM Roles');
});
afterEach(async () => {
  await DB.execute('DELETE FROM Roles');
});
afterAll(() => DB.close());

/* eslint-disable quote-props */
const VALID_JOIN_ROLES = { JoinRoles: ['1', '2', '3'], LevelRoles: null };
const COMBINED_ROLES = { JoinRoles: ['1', '2', '3'], LevelRoles: { '1': '123', '2': '456', '3': '789' } };
/* eslint-enable quote-props */

describe('POST', () => {
  test('Valid (Combined)', () => {
    const request = http('POST', `${ROUTE}/1`, COMBINED_ROLES);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('No roles provided', () => {
    const request = http('POST', `${ROUTE}/1`, {});
    expect(request.statusCode).toStrictEqual(400);
  });
  test('Invalid (Already exists)', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(200);
    // See if duplicate will return HTTP 409
    const request = http('POST', `${ROUTE}/1`, COMBINED_ROLES);
    expect(request.statusCode).toStrictEqual(409);
  });
});

describe('GET', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(200);
    // We expect to fetch it with no issues
    const request = http('GET', `${ROUTE}/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('GET', `${ROUTE}/1`).statusCode).toStrictEqual(404);
  });
});

describe('PUT', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(200);
    // We expect to be able to update it with no issues
    const REQ = http('PUT', `${ROUTE}/1`, VALID_JOIN_ROLES);
    expect(REQ.statusCode).toStrictEqual(200);
  });
  test('Invalid (Settings empty)', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(200);
    expect(http('PUT', `${ROUTE}/1`, {}).statusCode).toStrictEqual(400);
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('PUT', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(404);
  });
});

describe('PATCH', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, VALID_JOIN_ROLES).statusCode).toStrictEqual(200);
    // We expect to be able to update it with no issues
    const REQ = http('PATCH', `${ROUTE}/1`, COMBINED_ROLES);
    expect(REQ.statusCode).toStrictEqual(200);
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('PATCH', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(404);
  });
  test('Invalid (No settings provided)', () => {
    expect(http('PATCH', `${ROUTE}/1`, {}).statusCode).toStrictEqual(400);
  });
});

describe('DELETE', () => {
  test('Valid', () => {
    // Create an entry
    expect(http('POST', `${ROUTE}/1`, COMBINED_ROLES).statusCode).toStrictEqual(200);
    // We expect to fetch it with no issues
    const request = http('DELETE', `${ROUTE}/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Invalid (Guild does not exist)', () => {
    expect(http('DELETE', `${ROUTE}/1`).statusCode).toStrictEqual(404);
  });
});
