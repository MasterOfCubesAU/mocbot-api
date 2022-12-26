import { addVerification, removeVerification, updateVerification } from '@src/verification';
import { createWarning } from '@src/warnings';
import DB from '@utils/DBHandler';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterEach(async () => {
  await DB.execute('DELETE FROM UserInGuilds');
});
afterAll(() => DB.close());

describe('addVerification()', () => {
  test('Valid', async () => {
    const result = await addVerification(1, 2);
    expect(result).toStrictEqual({
      UserID: '1',
      GuildID: '2',
      JoinTime: expect.any(String),
    });
  });
  test('Already exist', async () => {
    await addVerification(1, 2);
    await expect(addVerification(1, 2)).rejects.toThrow();
  });
});
describe('removeVerification()', () => {
  test('Guild ID not found', async () => {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 2]);
    await expect(removeVerification(1, 1)).rejects.toThrow();
  });
  test('User ID not found', async () => {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 2]);
    await expect(removeVerification(2, 2)).rejects.toThrow();
  });
  test('GuildID/userID exists in UserInGuilds, but not verification', async () => {
    await createWarning(2, 2, 'Test Reason', 2);
    await expect(removeVerification(2, 2)).rejects.toThrow();
    await DB.execute('DELETE FROM Warnings');
  });
  test('Valid', async () => {
    await addVerification(1, 2);
    await expect(removeVerification(1, 2)).resolves.not.toThrow();
  });
});

describe('updateVerification()', () => {
  test('Guild ID not found', async () => {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 2]);
    await expect(updateVerification(1, 1, { MessageID: 123, ChannelID: 456 })).rejects.toThrow();
  });
  test('User ID not found', async () => {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) VALUES (?, ?)', [1, 2]);
    await expect(updateVerification(2, 2, { MessageID: 123, ChannelID: 456 })).rejects.toThrow();
  });
  test('Valid', async () => {
    await addVerification(1, 2);
    await expect(updateVerification(1, 2, { MessageID: 123, ChannelID: 456 })).resolves.not.toThrow();
  });
  test('Invalid input (empty)', async () => {
    await addVerification(1, 2);
    await expect(updateVerification(1, 2, {})).rejects.toThrow();
  });
  test('Invalid input (missing one key)', async () => {
    await addVerification(1, 2);
    await expect(updateVerification(1, 2, { MessageID: 123 })).rejects.toThrow();
  });
});
