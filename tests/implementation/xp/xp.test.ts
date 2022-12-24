import DB from '@utils/DBHandler';
import { fetchGuildXP, fetchUserXP, deleteGuildXP, postUserXP, updateUserXP, deleteUserXP, replaceUserXP } from '@src/xp';

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

describe('Fetching Guild XP data', () => {
  test('Invalid Guild ID', async () => {
    await expect(fetchGuildXP(1)).rejects.toThrow();
  });
  test('Valid Guild ID', async () => {
    await expect(fetchGuildXP(789)).resolves.not.toThrow();
    expect(await fetchGuildXP(789)).toEqual(expect.arrayContaining([expect.objectContaining({ UserID: '123', GuildID: '789', XP: 7777, Level: 23 }), expect.objectContaining({ UserID: '124', GuildID: '789', XP: 3, Level: 1 })]));
  });
});

describe('Deleting Guild XP data', () => {
  test('Invalid Guild ID', async () => {
    await expect(deleteGuildXP(1)).rejects.toThrow();
  });
  test('Valid Guild ID', async () => {
    await expect(deleteGuildXP(789)).resolves.not.toThrow();
    await expect(fetchGuildXP(789)).rejects.toThrow();
  });
});

describe('Fetching User XP data', () => {
  test('Invalid Guild ID', async () => {
    await expect(fetchUserXP(1, 123)).rejects.toThrow();
  });
  test('Invalid User ID', async () => {
    await expect(fetchUserXP(789, 125)).rejects.toThrow();
  });
  test('Invalid Guild ID/User ID combo', async () => {
    await expect(fetchUserXP(790, 124)).rejects.toThrow();
  });
  test('Correct response', async () => {
    expect(await fetchUserXP(789, 123)).toMatchObject({ UserID: '123', GuildID: '789', XP: 7777, Level: 23 });
  });
});

describe('Posting User XP data', () => {
  test('Correct response', async () => {
    await expect(postUserXP(1, 1)).resolves.not.toThrow();
    // expect any number for userGuildID due to auto-increment
    expect(await fetchUserXP(1, 1)).toMatchObject({ UserID: '1', GuildID: '1', XP: 0, Level: 0 });
    // should fail when trying to add same user in same guild again
    await expect(postUserXP(1, 1)).rejects.toThrow();
  });
  test('Testing optional parameters past in', async () => {
    const time = Math.floor(Date.now() / 1000);
    await expect(postUserXP(1, 1, { XP: 1, Level: 1, XPLock: time, VoiceChannelXPLock: time })).resolves.not.toThrow();
    // expect any number for userGuildID due to auto-increment
    expect(await fetchUserXP(1, 1)).toMatchObject({ UserID: '1', GuildID: '1', XP: 1, Level: 1, XPLock: time, VoiceChannelXPLock: time });
  });
});

describe('Updating User XP data', () => {
  const newTime = Math.floor(Date.now() / 1000);
  test('Invalid guildID/userID provided', async () => {
    await expect(updateUserXP(790, 124, { XP: 333, Level: 11, XPLock: newTime })).rejects.toThrow();
  });
  test('No settings provided', async () => {
    await expect(updateUserXP(789, 123, {})).rejects.toThrow();
  });
  test('Correct response', async () => {
    const expected = { UserID: '124', GuildID: '789', XP: 333, Level: 11, XPLock: newTime };
    await expect(updateUserXP(789, 124, { XP: 333, Level: 11, XPLock: newTime })).resolves.not.toThrow();
    const result = await fetchUserXP(789, 124);
    expect(result).toEqual(expect.objectContaining(expected));
  });
});

describe('Deleting user XP data', () => {
  test('Invalid Guild ID', async () => {
    await expect(deleteUserXP(790, 124)).rejects.toThrow();
  });
  test('Valid Guild ID', async () => {
    await expect(deleteUserXP(789, 123)).resolves.not.toThrow();
    await expect(fetchUserXP(789, 123)).rejects.toThrow();
  });
});

describe('Replacing User XP data', () => {
  const newTime = Math.floor(Date.now() / 1000);
  test('Invalid guildID/userID provided', async () => {
    await expect(replaceUserXP(790, 124, { XP: 333, Level: 11, XPLock: newTime, VoiceChannelXPLock: newTime })).rejects.toThrow();
  });
  test('Correct response', async () => {
    const expected = { UserID: '124', GuildID: '789', XP: 333, Level: 11, XPLock: newTime, VoiceChannelXPLock: newTime };
    await expect(replaceUserXP(789, 124, { XP: 333, Level: 11, XPLock: newTime, VoiceChannelXPLock: newTime })).resolves.not.toThrow();
    const result = await fetchUserXP(789, 124);
    expect(result).toEqual(expect.objectContaining(expected));
  });
});
