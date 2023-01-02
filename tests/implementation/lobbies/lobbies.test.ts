/* eslint-disable quote-props */
import DB from '@utils/DBHandler';
import { createLobby, getLobby, getGuildLobbies, setLobby, updateLobby, addLobbyUsers, deleteLobbyUser, deleteLobby, getLobbyUsers, getAllLobbies, getLobbyByUser } from '@src/lobbies';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM Lobbies');
});
afterEach(async () => {
  await DB.execute('DELETE FROM Lobbies');
});
afterAll(() => DB.close());

const VALID_LOBBY_INPUT = {
  LobbyName: 'ABC',
  VoiceChannelID: '1234',
  TextChannelID: '6789',
  RoleID: '101',
  LeaderID: '2468',
  InviteOnly: true,
};
const VALID_LOBBY_OUTPUT = {
  GuildID: '1',
  LobbyName: 'ABC',
  VoiceChannelID: '1234',
  TextChannelID: '6789',
  RoleID: '101',
  LeaderID: '2468',
  InviteOnly: true,
};

const LOBBY_LEADER_ID = BigInt(VALID_LOBBY_INPUT.LeaderID);

// Lobby Testing

describe('Get Lobbies by guild', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(await getGuildLobbies(1)).toStrictEqual([VALID_LOBBY_OUTPUT]);
  });
  test('Guild ID does not exist', async () => {
    await expect(getGuildLobbies(1)).rejects.toThrow();
  });
});

describe('Get all lobbies', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(await getAllLobbies()).toStrictEqual([VALID_LOBBY_OUTPUT]);
  });
  test('Guild ID does not exist', async () => {
    await expect(getAllLobbies()).rejects.toThrow();
  });
});

describe('Create Lobby', () => {
  test('Valid', async () => {
    expect(await createLobby(1, VALID_LOBBY_INPUT)).toStrictEqual(VALID_LOBBY_OUTPUT);
  });
  test('Missing values (all)', async () => {
    await expect(createLobby(1, {})).rejects.toThrow();
  });
  test('Missing values (some)', async () => {
    await expect(createLobby(1, { LobbyName: 'ABC' })).rejects.toThrow();
  });
  test('Already exist', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await expect(createLobby(1, VALID_LOBBY_INPUT)).rejects.toThrow();
  });
});

describe('Get Lobby by leader ID', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(await getLobby(1, LOBBY_LEADER_ID)).toStrictEqual(VALID_LOBBY_OUTPUT);
  });
  test('Lobby does not exist', async () => {
    await expect(getLobby(1, LOBBY_LEADER_ID)).rejects.toThrow();
  });
});

describe('Get Lobby by user ID', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await addLobbyUsers(1, LOBBY_LEADER_ID, ['2', '3']);
    expect(await getLobbyByUser(1, 2)).toStrictEqual(VALID_LOBBY_OUTPUT);
  });
  test('Lobby with that user does not exist', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await expect(getLobbyByUser(1, 2)).rejects.toThrow();
  });
});

describe('Replace Lobby', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(
      await setLobby(1, LOBBY_LEADER_ID, {
        LobbyName: 'DEF',
        VoiceChannelID: '1234',
        TextChannelID: '6789',
        RoleID: '101',
        LeaderID: '2468',
        InviteOnly: false,
      })
    ).toStrictEqual({
      GuildID: '1',
      LobbyName: 'DEF',
      VoiceChannelID: '1234',
      TextChannelID: '6789',
      RoleID: '101',
      LeaderID: '2468',
      InviteOnly: false,
    });
  });
  test('Missing values (all)', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await expect(setLobby(1, LOBBY_LEADER_ID, {})).rejects.toThrow();
  });
  test('Missing values (some)', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await expect(setLobby(1, LOBBY_LEADER_ID, { InviteOnly: true, LobbyName: 'ABC' })).rejects.toThrow();
  });
  test('Lobby does not exist', async () => {
    await expect(
      setLobby(1, LOBBY_LEADER_ID, {
        LobbyName: 'DEF',
        VoiceChannelID: '1234',
        TextChannelID: '6789',
        RoleID: '101',
        LeaderID: '2468',
        InviteOnly: false,
      })
    ).rejects.toThrow();
  });
});

describe('Replace Lobby', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(
      await updateLobby(1, LOBBY_LEADER_ID, {
        LobbyName: 'DEF',
        InviteOnly: false,
      })
    ).toStrictEqual({
      GuildID: '1',
      LobbyName: 'DEF',
      VoiceChannelID: '1234',
      TextChannelID: '6789',
      RoleID: '101',
      LeaderID: '2468',
      InviteOnly: false,
    });
  });
  test('Missing values (all)', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await expect(updateLobby(1, LOBBY_LEADER_ID, {})).rejects.toThrow();
  });
  test('Lobby does not exist', async () => {
    await expect(
      updateLobby(1, LOBBY_LEADER_ID, {
        LobbyName: 'DEF',
        InviteOnly: false,
      })
    ).rejects.toThrow();
  });
});

describe('Delete Lobby', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(await deleteLobby(1, 2468)).toStrictEqual({});
  });
  test('Lobby does not exist', async () => {
    await expect(deleteLobby(1, 2468)).rejects.toThrow();
  });
});

// Lobby User Testing

describe('Get Lobby Users', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await addLobbyUsers(1, LOBBY_LEADER_ID, ['1', '2', '3', '4', '5']);
    expect(await getLobbyUsers(1, LOBBY_LEADER_ID)).toStrictEqual(['1', '2', '3', '4', '5']);
  });
  test('Lobby does not exist', async () => {
    await expect(getLobbyUsers(1, LOBBY_LEADER_ID)).rejects.toThrow();
  });
});

describe('Add Users', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    expect(await addLobbyUsers(1, LOBBY_LEADER_ID, ['1', '2', '3', '4', '5'])).toStrictEqual(['1', '2', '3', '4', '5']);
  });
  test('No new users', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await expect(addLobbyUsers(1, LOBBY_LEADER_ID, [])).rejects.toThrow();
  });
  test('Lobby not found', async () => {
    await expect(addLobbyUsers(1, LOBBY_LEADER_ID, ['1', '2', '3', '4', '5'])).rejects.toThrow();
  });
});

describe('Delete Lobby Users', () => {
  test('Valid', async () => {
    await createLobby(1, VALID_LOBBY_INPUT);
    await addLobbyUsers(1, LOBBY_LEADER_ID, ['1', '2', '3', '4', '5']);
    expect(await deleteLobbyUser(1, LOBBY_LEADER_ID, 1)).toStrictEqual({});
    expect(await getLobbyUsers(1, LOBBY_LEADER_ID)).toStrictEqual(['2', '3', '4', '5']);
  });
  test('Lobby does not exist', async () => {
    await expect(deleteLobbyUser(1, LOBBY_LEADER_ID, 1)).rejects.toThrow();
  });
});
