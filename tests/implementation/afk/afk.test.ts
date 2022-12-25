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

const VALID_AFK_DATA = {
  MessageID: 1056206377569222700,
  ChannelID: 673449065593438200,
  OldName: 'A',
  Reason: 'B'
};

describe('Add a user into AFK', () => {
  test('Valid', async () => {
    expect(await insertAFK(1, 2, VALID_AFK_DATA)).toStrictEqual(
      {
        UserID: '1n',
        GuildID: '2n',
        MessageID: VALID_AFK_DATA.MessageID,
        ChannelID: VALID_AFK_DATA.ChannelID,
        OldName: VALID_AFK_DATA.OldName,
        Reason: VALID_AFK_DATA.Reason
      }
    );
  });
  test('Empty AFKData', async () => {
    await expect(insertAFK(1, 2, {})).rejects.toThrow();
  });
  test('Incomplete AFKData', async () => {
    const AFKData = {
      MessageID: 1056206377569222700,
      ChannelID: 673449065593438200
    };
    await expect(insertAFK(1, 2, AFKData)).rejects.toThrow();
  });
  test('User already in AFK', async () => {
    await insertAFK(1, 2, VALID_AFK_DATA);

    await expect(insertAFK(1, 2, AFKData)).rejects.toThrow();
  });
});

describe('Get AFKData', () => {
  test('Valid', async () => {
    await insertAFK(1, 2, VALID_AFK_DATA);

    expect(await getAFK(1, 2)).toStrictEqual(
      {
        UserID: '1n',
        GuildID: '2n',
        MessageID: VALID_AFK_DATA.MessageID,
        ChannelID: VALID_AFK_DATA.ChannelID,
        OldName: VALID_AFK_DATA.OldName,
        Reason: VALID_AFK_DATA.Reason
      }
    );
  });
  test('Guild/User ID not found', async () => {
    await expect(getAFK(1, 2, VALID_AFK_DATA)).rejects.toThrow();
  });
});

describe('Remove AFKData', () => {
  test('Valid', async () => {
    await insertAFK(1, 2, VALID_AFK_DATA);

    expect(await removeAFK(1, 2)).toStrictEqual({});
  });
  test('Guild/User ID not found', async () => {
    await expect(removeAFK(1, 2)).rejects.toThrow();
  });
});
