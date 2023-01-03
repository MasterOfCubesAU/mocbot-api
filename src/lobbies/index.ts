import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { GuildLobby, GuildLobbyInput } from '@src/interfaces/lobbies';
import lodash from 'lodash';

const selectQuery = 'GuildID, LobbyName, VoiceChannelID, TextChannelID, RoleID, LeaderID, InviteOnly';

/**
 * Fetches all the lobbies in a guild
 *
 * @param {bigint | number} guildID - the guildID to fetch lobbies for
 * @throws {createErrors<404>} - if there are no lobbies for the provided guild
 * @returns {Promise<GuildLobby[]>}
 */
export async function getGuildLobbies(guildID: bigint | number): Promise<GuildLobby[]> {
  const res: GuildLobby[] = await DB.records(`SELECT ${selectQuery} FROM LobbyAndGuilds WHERE GuildID = ?`, [guildID]);
  if (res.length === 0) {
    throw createErrors(404, 'There are no lobbies in the provided guild');
  }
  return res.map((l) => {
    return { ...l, InviteOnly: Boolean(l.InviteOnly) };
  });
}

/**
 * Creates a new lobby for the guild
 *
 * @param {bigint | number} guildID - the guildID to make a new lobby in
 * @param {GuildLobbyInput} data - the data for the new lobby
 * @throws {createErrors<400>} - missing data for the new lobby/missing properties in input object
 * @returns {Promise<GuildLobby>}
 */
export async function createLobby(guildID: bigint | number, data: GuildLobbyInput): Promise<GuildLobby> {
  checkInputData(data);
  if ((await DB.field('SELECT LobbyID FROM Lobbies WHERE GuildID = ? AND LeaderID = ?', [guildID, data.LeaderID])) !== null) {
    throw createErrors(409, 'The user is already a leader of another lobby in this guild!');
  }

  await DB.execute('INSERT INTO Lobbies (GuildID, LeaderID) VALUES (?, ?)', [guildID, data.LeaderID]);
  const lobbyID = await DB.field('SELECT LAST_INSERT_ID()');
  await DB.execute('INSERT INTO LobbyDetails VALUES (?, ?, ?, ?, ?, ?)', [lobbyID, data.LobbyName, data.VoiceChannelID, data.TextChannelID, data.RoleID, data.InviteOnly]);
  return {
    GuildID: guildID.toString(),
    LobbyName: data.LobbyName,
    VoiceChannelID: data.VoiceChannelID,
    TextChannelID: data.TextChannelID,
    RoleID: data.RoleID,
    LeaderID: data.LeaderID,
    InviteOnly: data.InviteOnly,
  };
}

/**
 * Gets lobby data from a given guild ID and leader ID
 *
 * @param {bigint | number} guildID - the guild ID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<GuildLobby>}
 */
export async function getLobby(guildID: bigint | number, leaderID: bigint | number): Promise<GuildLobby> {
  const res: GuildLobby = await DB.record(`SELECT ${selectQuery} FROM LobbyAndGuilds WHERE GuildID = ? AND LeaderID = ?`, [guildID, leaderID]);
  if (Object.keys(res).length === 0) {
    throw createErrors(404, 'No lobby was found for the provided inputs');
  }
  res.InviteOnly = Boolean(res.InviteOnly);
  return res;
}

/**
 * Replaces all existing lobby data with new data for a given guild ID and leader ID
 *
 * @param {bigint | number} guildID - the guildID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @param {GuildLobbyInput} newData - the new data to replace for the lobby
 * @throws {createErrors<400>} - missing data for the new lobby/missing properties in input object
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<GuildLobby>}
 */
export async function setLobby(guildID: bigint | number, leaderID: bigint | number, newData: GuildLobbyInput): Promise<GuildLobby> {
  checkInputData(newData);
  const lobbyID = await getLobbyID(guildID, leaderID);

  await updateLobbyData(newData, lobbyID);
  return {
    GuildID: guildID.toString(),
    LobbyName: newData.LobbyName,
    VoiceChannelID: newData.VoiceChannelID,
    TextChannelID: newData.TextChannelID,
    RoleID: newData.RoleID,
    LeaderID: newData.LeaderID,
    InviteOnly: Boolean(newData.InviteOnly),
  };
}

/**
 * Updates existing lobby data with the new provided data for a given guild ID and leader ID
 *
 * @param {bigint | number} guildID - the guildID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @param {UpdateGuildLobbyInput} inputData - the new data to replace for the lobby
 * @throws {createErrors<400>} - new data was not provided
 * @throws {createErrors<404>} - lobby not found
 * @returns {Promise<GuildLobby>}
 */
export async function updateLobby(guildID: bigint | number, leaderID: bigint | number, inputData: GuildLobbyInput): Promise<GuildLobby> {
  if (Object.keys(inputData).length === 0) {
    throw createErrors(400, 'New settings for this guild must be provided.');
  }

  const lobbyID = await getLobbyID(guildID, leaderID);
  const oldData: GuildLobby = await getLobby(guildID, leaderID);
  const newData: GuildLobby = lodash.merge(oldData, inputData);
  await updateLobbyData(newData, lobbyID);
  return newData;
}

/**
 * Deletes existing lobby data with the given guild ID and leader ID
 * @param {bigint | number} guildID - the guildID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @throws {createErrors<404>} - lobby not found
 * @returns {Promise<Record<string, never>>}
 */
export async function deleteLobby(guildID: bigint | number, leaderID: bigint | number): Promise<Record<string, never>> {
  const lobbyID = await getLobbyID(guildID, leaderID);
  await DB.execute('DELETE FROM Lobbies WHERE LobbyID = ?', [lobbyID]);
  return {};
}

/**
 * Gets lobby users from a given guild ID and leader ID
 *
 * @param {bigint | number} guildID - the guild ID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<string[]>}
 */
export async function getLobbyUsers(guildID: bigint | number, leaderID: bigint | number): Promise<string[]> {
  const lobbyID = await getLobbyID(guildID, leaderID);
  return await DB.column('SELECT UserID FROM LobbyUsers WHERE LobbyID = ?', [lobbyID]);
}

/**
 * Adds new user(s) into the given lobby
 *
 * @param {bigint | number} guildID - the guild ID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @param {string[]} data - an array of user IDs to add into the lobby
 * @throws {createErrors<400>} - if the input array is empty
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<string[]>}
 */
export async function addLobbyUsers(guildID: bigint | number, leaderID: bigint | number, data: string[]): Promise<string[]> {
  if (data.length === 0) {
    throw createErrors(400, 'No new users were provided');
  }
  const lobbyID = await getLobbyID(guildID, leaderID);

  await DB.execute('INSERT INTO LobbyUsers (LobbyID, UserID) VALUES ?', [data.map((k) => [lobbyID, k])], true);
  return data;
}

/**
 * Deletes user from a given lobby
 *
 * @param {bigint | number} guildID - the guild ID of the guild that the lobby belongs to
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @param {bigint | number} userID - a userID to delete from the lobby
 * @throws {createErrors<400>} - if the input array is empty
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<Record<string, never>>}
 */
export async function deleteLobbyUser(guildID: bigint | number, leaderID: bigint | number, userID: bigint | number): Promise<Record<string, never>> {
  if (userID === undefined || null) {
    throw createErrors(400, 'No users were provided');
  }
  const lobbyID = await getLobbyID(guildID, leaderID);
  await DB.execute('DELETE FROM LobbyUsers WHERE LobbyID = ? AND UserID = ?', [lobbyID, userID], true);
  return {};
}

/**
 * Gets lobby data from a given guild ID and user ID
 *
 * @param {bigint | number} guildID - the guild ID of the guild that the lobby belongs to
 * @param {bigint | number} userID - the user ID of the user who owns the lobby
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<GuildLobby>}
 */
export async function getLobbyByUser(guildID: bigint | number, userID: bigint | number): Promise<GuildLobby> {
  const res: GuildLobby = await DB.record(`SELECT ${selectQuery} FROM LobbyAndGuilds g INNER JOIN LobbyUsers u ON g.LobbyID = u.LobbyID WHERE GuildID = ? AND UserID = ?`, [guildID, userID]);
  if (Object.keys(res).length === 0) {
    throw createErrors(404, 'No lobby was found for the provided inputs');
  }
  res.InviteOnly = Boolean(res.InviteOnly);
  return res;
}

/**
 * Gets data for all lobbies
 *
 * @throws {createErrors<404>} - if no lobbies exist
 * @returns {Promise<GuildLobby[]>}
 */
export async function getAllLobbies(): Promise<GuildLobby[]> {
  const res: GuildLobby[] = await DB.records(`SELECT ${selectQuery} FROM LobbyAndGuilds`);
  if (res.length === 0) {
    throw createErrors(404, 'No lobbies exist');
  }
  return res.map((l) => {
    return { ...l, InviteOnly: Boolean(l.InviteOnly) };
  });
}

/**
 * Checks if the provided input data is valid by checking null values
 *
 * @param {GuildLobbyInput} data - the input data to check
 * @throws {createErrors<400>} - missing data for lobby/no data provided
 */
function checkInputData(data: GuildLobbyInput) {
  if (Object.keys(data).length === 0) {
    throw createErrors(400, 'No data was provided');
  }
  if (!('LobbyName' in data && 'VoiceChannelID' in data && 'TextChannelID' in data && 'RoleID' in data && 'LeaderID' in data && 'InviteOnly' in data)) {
    throw createErrors(400, 'Missing data for lobby');
  }
  if (Object.values(data).some((v) => v === null)) {
    throw createErrors(400, 'Missing data for lobby');
  }
}

/**
 * Internal use only - fetches the lobby ID given a guildID and leaderID
 *
 * @param {bigint | number} guildID - the guildID of the lobby
 * @param {bigint | number} leaderID - the user ID of the user who owns the lobby
 * @throws {createErrors<404>} - if the lobby cannot be found
 * @returns {Promise<string>}
 */
async function getLobbyID(guildID: bigint | number, leaderID: bigint | number): Promise<string> {
  const res: string = await DB.field('SELECT LobbyID FROM Lobbies WHERE GuildID = ? AND LeaderID = ?', [guildID, leaderID]);
  if (res === null) {
    throw createErrors(404, 'Lobby was not found');
  }
  return res;
}

/**
 * Updates the data regarding a lobby in the database
 *
 * @param {GuildLobbyInput} newData - the new data to update for the lobby
 * @param {bigint | number} lobbyID - the ID of the lobby to update
 */
async function updateLobbyData(newData: GuildLobbyInput, lobbyID: string) {
  await DB.execute('UPDATE Lobbies SET LeaderID = ? WHERE LobbyID = ?', [newData.LeaderID, lobbyID]);
  await DB.execute('UPDATE LobbyDetails SET LobbyName = ?, VoiceChannelID = ?, TextChannelID = ?, RoleID = ?, InviteOnly = ? WHERE LobbyID = ?', [
    newData.LobbyName,
    newData.VoiceChannelID,
    newData.TextChannelID,
    newData.RoleID,
    newData.InviteOnly,
    lobbyID,
  ]);
}
