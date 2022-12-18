import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/settings';

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
    expect(http('POST', `${ROUTE}/1`, undefined, { setting1: true }).statusCode).toStrictEqual(200);
    const request = http('POST', `${ROUTE}/1`, undefined, { setting1: true });
    expect(request.statusCode).toStrictEqual(409);
  });
});
