import { http } from '@test-utils/index';
import DB from '@utils/DBHandler';

const ROUTE = '/v1/lobby';

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

const LOBBY_LEADER_ID = VALID_LOBBY_INPUT.LeaderID;
const GUILD_ID = VALID_LOBBY_OUTPUT.LeaderID;

// Lobby Testing

describe('GET /lobbies by guild', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT).statusCode).toStrictEqual(200);
    expect(http('GET', `/v1/lobbies/${GUILD_ID}`).statusCode).toStrictEqual(200);
  });
  test('Guild ID does not exist', () => {
    expect(http('GET', `/v1/lobbies/${GUILD_ID}`).statusCode).toStrictEqual(404);
  });
});

describe('POST', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT).statusCode).toStrictEqual(200);
  });
  test('Missing values (all)', () => {
    expect(http('POST', `${ROUTE}/${GUILD_ID}`, {}).statusCode).toStrictEqual(400);
  });
  test('Missing values (some)', () => {
    expect(http('POST', `${ROUTE}/${GUILD_ID}`, { InviteOnly: false, LobbyName: 'ABC' }).statusCode).toStrictEqual(400);
  });
  test('Already exist', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT).statusCode).toStrictEqual(409);
  });
});

describe('GET lobby by leader', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('GET', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`).statusCode).toStrictEqual(200);
  });
  test('Lobby does not exist', () => {
    expect(http('GET', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`).statusCode).toStrictEqual(404);
  });
});

describe('GET lobby by user', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('POST', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`, ['1']).statusCode).toStrictEqual(200);
    expect(http('GET', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`).statusCode).toStrictEqual(200);
  });
  test('Lobby does not exist with inputs', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('GET', `/v1/lobbies/${GUILD_ID}/1`).statusCode).toStrictEqual(404);
  });
});

describe('GET all lobbies', () => {
  test('Valid', () => {
    expect(http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT).statusCode).toStrictEqual(200);
    expect(http('GET', '/v1/lobbies').statusCode).toStrictEqual(200);
  });
  test('No guilds exist', () => {
    expect(http('GET', '/v1/lobbies').statusCode).toStrictEqual(404);
  });
});

describe('PUT', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(
      http('PUT', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, {
        LobbyName: 'DEF',
        VoiceChannelID: '1234',
        TextChannelID: '6789',
        RoleID: '101',
        LeaderID: '2468',
        InviteOnly: false,
      }).statusCode
    ).toStrictEqual(200);
  });
  test('Missing values (all)', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('PUT', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, {}).statusCode).toStrictEqual(400);
  });
  test('Missing values (some)', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('PUT', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, { InviteOnly: false, LobbyName: 'ABC' }).statusCode).toStrictEqual(400);
  });
  test('Lobby does not exist', () => {
    expect(
      http('PUT', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, {
        LobbyName: 'DEF',
        VoiceChannelID: '1234',
        TextChannelID: '6789',
        RoleID: '101',
        LeaderID: '2468',
        InviteOnly: false,
      }).statusCode
    ).toStrictEqual(404);
  });
});

describe('PATCH', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(
      http('PATCH', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, {
        LobbyName: 'DEF',
        InviteOnly: false,
      }).statusCode
    ).toStrictEqual(200);
  });
  test('Missing values (all)', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('PATCH', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, {}).statusCode).toStrictEqual(400);
  });
  test('Lobby does not exist', () => {
    expect(
      http('PATCH', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`, {
        LobbyName: 'DEF',
        InviteOnly: false,
      }).statusCode
    ).toStrictEqual(404);
  });
});

describe('DELETE', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('DELETE', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`).statusCode).toStrictEqual(200);
  });
  test('Lobby does not exist', () => {
    expect(http('DELETE', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}`).statusCode).toStrictEqual(404);
  });
});

// Lobby User Testing

describe('Get Lobby Users', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    http('POST', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`, ['1', '2', '3', '4', '5']);
    expect(http('GET', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`).statusCode).toStrictEqual(200);
  });
  test('Lobby does not exist', () => {
    expect(http('GET', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`).statusCode).toStrictEqual(404);
  });
});

describe('Add Users', () => {
  test('Valid', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('POST', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`, ['1', '2', '3', '4', '5']).statusCode).toStrictEqual(200);
  });
  test('No new users', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    expect(http('POST', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`, []).statusCode).toStrictEqual(400);
  });
  test('Lobby not found', () => {
    expect(http('POST', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`, ['1', '2', '3', '4', '5']).statusCode).toStrictEqual(404);
  });
});

describe('Delete Lobby Users', () => {
  test('Valid (Single)', () => {
    http('POST', `${ROUTE}/${GUILD_ID}`, VALID_LOBBY_INPUT);
    http('POST', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/users`, ['1', '2', '3', '4', '5']);
    expect(http('DELETE', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/1`).statusCode).toStrictEqual(200);
  });
  test('Lobby does not exist', () => {
    expect(http('DELETE', `${ROUTE}/${GUILD_ID}/${LOBBY_LEADER_ID}/1`).statusCode).toStrictEqual(404);
  });
});
