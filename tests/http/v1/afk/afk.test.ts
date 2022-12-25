import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/afk';

beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterEach(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterAll(() => DB.close());

const VALID_AFK_DATA = {
  MessageID: 1056206377569222700,
  ChannelID: 673449065593438200,
  OldName: 'A',
  Reason: 'B'
};

describe('Add User into AFK', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/2/1`, VALID_AFK_DATA).statusCode).toStrictEqual(200);
  });
  test('AFKData missing', () => {
    expect(http('POST', `${ROUTE}/2/1`, {}).statusCode).toStrictEqual(400);
  });
  test('AFKData incomplete', () => {
    const AFKData = {
      MessageID: 1056206377569222700,
      ChannelID: 673449065593438200
    };
    expect(http('POST', `${ROUTE}/2/1`, AFKData).statusCode).toStrictEqual(400);
  });
  test('User already in AFK', () => {
    http('POST', `${ROUTE}/2/1`, VALID_AFK_DATA);
    expect(http('POST', `${ROUTE}/2/1`, VALID_AFK_DATA).statusCode).toStrictEqual(409);
  });
});

describe('Get User from AFK', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/2/1`, VALID_AFK_DATA);
    expect(http('GET', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
  });
  test('Guild/User ID not found', () => {
    expect(http('GET', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
  });
});

describe('Remove User from AFK', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/2/1`, VALID_AFK_DATA);
    expect(http('DELETE', `${ROUTE}/2/1`).statusCode).toStrictEqual(200);
  });
  test('Guild/User ID not found', () => {
    expect(http('DELETE', `${ROUTE}/2/1`).statusCode).toStrictEqual(404);
  });
});
