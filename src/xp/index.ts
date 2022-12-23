import { UserXPInput, UserXP } from '@src/interfaces/xp';
import DB from '@utils/DBHandler';
import getUserGuildID from '@utils/GetUserGuildID';
import createErrors from 'http-errors';
import lodash from 'lodash';

const selectQuery = ' x.UserGuildID, x.XP, x.Level, UNIX_TIMESTAMP(x.XPLock) AS XPLock, UNIX_TIMESTAMP(x.VoiceChannelXPLock) AS VoiceChannelXPLock';

/**
 * Fetches all the XP data for the given guildId
 *
 * @param {bigint | number} guildID - the guild id to fetch xp for
 * @throws {createErrors<404>} - when guildId is not found in database
 * @returns {object}
 */
export async function fetchGuildXP(guildID: bigint | number): Promise<UserXP[]> {
  const result: UserXP[] = await DB.records(`SELECT ${selectQuery} FROM XP AS x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ?`, [guildID]);
  if (result.length === 0) throw createErrors(404, 'Guild ID not found in database');
  return result;
}

/**
 * Deletes the XP data for a given guildId
 *
 * @param {bigint | number} guildID - the guild id to delete xp data for
 * @throws {createErrors<404>} - when guildId is not found in database
 * @returns {} - on success
 */
export async function deleteGuildXP(guildID: bigint | number): Promise<Record<string, never>> {
  if ((await DB.records(`SELECT ${selectQuery} FROM XP as x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE GuildID = ?`, [guildID])).length === 0) {
    throw createErrors(404, 'This guild does not exist.');
  }

  await DB.execute('DELETE x FROM XP x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ?', [guildID]);
  return {};
}

/**
 * Fetches all the XP data for the given userId
 *
 * @param {bigint | number} guildID - the guild id to fetch xp for
 * @param {bigint | number} userID - the user id to fetch xp for
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found
 * @returns {object}
 */
export async function fetchUserXP(guildID: bigint | number, userID: bigint | number): Promise<UserXP> {
  const result: UserXP = await DB.record(`SELECT ${selectQuery} FROM XP AS x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ? AND u.UserID = ?`, [guildID, userID]);
  if (Object.keys(result).length === 0) {
    throw createErrors(404, 'This Guild/User ID does not exist.');
  }
  return result;
}

/**
 * Creates a new XP object for a user, if the user/guild combination does not exist, it will create
 * a new entry in the UserInGuilds table
 *
 * @param {bigint | number} guildID - the guild id to create xp object for
 * @param {bigint | number} userID - the user id to create xp object for
 * @param {UserXPInput} newXP - the new data to post, time should be in epoch seconds
 * @throws {createErrors<409>} - when an entry for that user in that guild already exists
 * @returns {object}
 */
export async function postUserXP(guildID: bigint | number, userID: bigint | number, newXP?: UserXPInput): Promise<UserXP> {
  let userGuildID: number = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  if (userGuildID === null) {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) values (?, ?)', [userID, guildID]);
    userGuildID = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  }

  const result: UserXP = {
    UserGuildID: userGuildID,
    XP: newXP?.XP || 0,
    Level: newXP?.Level || 0,
    XPLock: newXP?.XPLock || Math.floor(Date.now() / 1000),
    VoiceChannelXPLock: newXP?.VoiceChannelXPLock || Math.floor(Date.now() / 1000),
  };

  try {
    await DB.execute('INSERT INTO XP (UserGuildID, XP, Level, XPLock, VoiceChannelXPLock) VALUES (?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))', Object.values(result));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createErrors(409, 'XP data for this user in this guild already exists.');
    } else {
      throw error;
    }
  }

  return result;
}

/**
 * Deletes the XP data for a given guildId and userId
 *
 * @param {bigint | number} guildID - the guild id to delete xp data for
 * @param {bigint | number} userID - the user id to delete xp data for
 * @throws {createErrors<404>} - when guildId/userId is not found in database
 * @returns {} - on success
 */
export async function deleteUserXP(guildID: bigint | number, userID: bigint | number): Promise<Record<string, never>> {
  const userGuildID = await getUserGuildID(guildID, userID);
  await DB.execute('DELETE FROM XP WHERE UserGuildID = ?', [userGuildID]);
  return {};
}

/**
 * Updates an existing XP object for a user
 *
 * @param {bigint | number} guildID - the guild id to update the xp object for
 * @param {bigint | number} userID - the user id to update the xp object for
 * @param {UserXPInput} newXP - the new data to update, time should be in epoch seconds
 * @throws {createErrors<400>} - when no new XP data is provided
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found, or the user has no XP data in that guild
 * @returns {UserXPResult}
 */
export async function updateUserXP(guildID: bigint | number, userID: bigint | number, newXP: UserXPInput): Promise<UserXP> {
  if (Object.keys(newXP).length === 0) {
    throw createErrors(400, 'No new data was provided');
  }
  const oldXP: UserXP = await DB.record(`SELECT ${selectQuery} FROM XP x INNER JOIN UserInGuilds u ON x.UserGuildID = u.UserGuildID WHERE u.UserID = ? AND u.GuildID = ?`, [userID, guildID]);
  if (Object.keys(oldXP).length === 0) {
    throw createErrors(404, 'XP data for this user in this guild does not exist.');
  }

  const userGuildID = oldXP.UserGuildID;
  const newData: UserXP = lodash.merge(oldXP, newXP);

  await DB.execute('UPDATE XP SET XP = ?, Level = ?, XPLock = FROM_UNIXTIME(?), VoiceChannelXPLock = FROM_UNIXTIME(?) WHERE UserGuildID = ?', [newData.XP, newData.Level, newData.XPLock, newData.VoiceChannelXPLock, userGuildID]);
  return newData;
}
