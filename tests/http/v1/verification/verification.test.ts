import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/verification';

beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterEach(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterAll(() => DB.close());

describe('Add Verification', () => {
  test('Valid', () => {
    const request = http('POST', `${ROUTE}/2/1`);
    expect(request.statusCode).toStrictEqual(200);
  });
  test('Already exist', () => {
    expect(http('POST', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
    expect(http('POST', `${ROUTE}/2/1`).statusCode).toStrictEqual(409);
  });
});

describe('Remove Verification', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
    expect(http('DELETE', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
  });
  test('Invalid Guild/User ID', () => {
    expect(http('DELETE', `${ROUTE}/2/1`).statusCode).toStrictEqual(404);
  });
});

describe('Update Verification', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
    expect(http('PATCH', `${ROUTE}/2/1`, { MessageID: 123, ChannelID: 456 }).statusCode).toStrictEqual(200);
  });
  test('Invalid Guild/User ID', () => {
    expect(http('PATCH', `${ROUTE}/2/1`, { MessageID: 123, ChannelID: 456 }).statusCode).toStrictEqual(404);
  });
  test('Missing body', () => {
    expect(http('PATCH', `${ROUTE}/2/1`, {}).statusCode).toStrictEqual(400);
  });
});
