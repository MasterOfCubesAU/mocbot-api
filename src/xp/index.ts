import { CreateUserXPInput, UserXP, ReplaceUserXPInput } from '@src/interfaces/xp';
import DB from '@utils/DBHandler';
import { createUserGuildID, getUserGuildID } from '@utils/Misc';
import createErrors from 'http-errors';
import lodash from 'lodash';

const selectQuery = 'UserID, GuildID, XP, Level, XPLock, VoiceChannelXPLock';

/**
 * Fetches all the XP data for the given guildID
 *
 * @param {bigint | number} guildID - the guildID to fetch XP data for
 * @throws {createErrors<404>} - when guildID is not found in database
 * @returns {Promise<UserXP[]>}
 */
export async function fetchGuildXP(guildID: bigint | number): Promise<UserXP[]> {
  const result: UserXP[] = await DB.records(`SELECT ${selectQuery} FROM UserGuildXP WHERE GuildID = ?`, [guildID]);
  if (result.length === 0) throw createErrors(404, 'No XP data for that guild was found in database');
  return result;
}

/**
 * Deletes the XP data for a given guildID
 *
 * @param {bigint | number} guildID - the guildID to delete XP data for
 * @throws {createErrors<404>} - when guildID is not found in database
 * @returns {} - on success
 */
export async function deleteGuildXP(guildID: bigint | number): Promise<Record<string, never>> {
  await fetchGuildXP(guildID);
  await DB.execute('DELETE x FROM XP x INNER JOIN UserGuildXP u ON x.UserGuildID = u.UserGuildID WHERE u.GuildID = ?', [guildID]);
  return {};
}

/**
 * Fetches all the XP data for the given userID in the given guildID
 *
 * @param {bigint | number} guildID - the guildID to fetch user XP data in
 * @param {bigint | number} userID - the userID to fetch XP data for
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found
 * @returns {Promise<UserXP>}
 */
export async function fetchUserXP(guildID: bigint | number, userID: bigint | number): Promise<UserXP> {
  const result: UserXP = await DB.record(`SELECT ${selectQuery} FROM UserGuildXP WHERE GuildID = ? AND UserID = ?`, [guildID, userID]);
  if (Object.keys(result).length === 0) throw createErrors(404, 'No XP data for that user was found in database');
  return result;
}

/**
 * Creates a new XP object for a user, if the userID/guildID combination does not exist, it will create
 * a new entry in the UserInGuilds table
 *
 * @param {bigint | number} guildID - the guildID to create XP object for
 * @param {bigint | number} userID - the userID to create XP object for
 * @param {CreateUserXPInput} newXP - the new data to post; time should be in epoch seconds
 * @throws {createErrors<409>} - when an entry for that user in that guild already exists
 * @returns {Promise<UserXP>}
 */
export async function postUserXP(guildID: bigint | number, userID: bigint | number, newXP?: CreateUserXPInput): Promise<UserXP> {
  const userGuildID = await createUserGuildID(guildID, userID);
  const result: UserXP = {
    UserID: userID.toString(),
    GuildID: guildID.toString(),
    XP: (newXP?.XP || 0).toString(),
    Level: (newXP?.Level || 0).toString(),
    XPLock: (newXP?.XPLock || Math.floor(Date.now() / 1000)).toString(),
    VoiceChannelXPLock: (newXP?.VoiceChannelXPLock || Math.floor(Date.now() / 1000)).toString(),
  };

  try {
    await DB.execute('INSERT INTO XP (UserGuildID, XP, Level, XPLock, VoiceChannelXPLock) VALUES (?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))', [userGuildID, result.XP, result.Level, result.XPLock, result.VoiceChannelXPLock]);
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
 * Deletes the XP data for a given guildID and userID
 *
 * @param {bigint | number} guildID - the guildID to delete XP data from
 * @param {bigint | number} userID - the userID to delete XP data for
 * @throws {createErrors<404>} - when guildID/userID is not found in database
 * @returns {} - on success
 */
export async function deleteUserXP(guildID: bigint | number, userID: bigint | number): Promise<Record<string, never>> {
  const userGuildID = await getUserGuildID(guildID, userID, 'UserGuildXP');
  await DB.execute('DELETE FROM XP WHERE UserGuildID = ?', [userGuildID]);
  return {};
}

/**
 * Updates an existing XP object for a user
 *
 * @param {bigint | number} guildID - the guildID of the user to update the XP object for
 * @param {bigint | number} userID - the userID to update the XP object for
 * @param {CreateUserXPInput} newXP - the new data to update, time should be in epoch seconds
 * @throws {createErrors<400>} - when no new XP data is provided
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found, or the user has no XP data in that guild
 * @returns {Promise<UserXP>}
 */
export async function updateUserXP(guildID: bigint | number, userID: bigint | number, newXP: CreateUserXPInput): Promise<UserXP> {
  if (Object.keys(newXP).length === 0) {
    throw createErrors(400, 'No new data was provided');
  }

  const oldXP: UserXP = await fetchUserXP(guildID, userID);
  const userGuildID = await getUserGuildID(guildID, userID, 'UserGuildXP');
  const newData: UserXP = lodash.merge(oldXP, newXP);
  await DB.execute('UPDATE XP SET XP = ?, Level = ?, XPLock = FROM_UNIXTIME(?), VoiceChannelXPLock = FROM_UNIXTIME(?) WHERE UserGuildID = ?', [newData.XP, newData.Level, newData.XPLock, newData.VoiceChannelXPLock, userGuildID]);
  return newData;
}

/**
 * Replaces an existing XP object for a user
 *
 * @param {bigint | number} guildID - the guildID of the user to update the XP object for
 * @param {bigint | number} userID - the userID to replace the XP object for
 * @param {ReplaceUserXPInput} newXP - the new data to update, time should be in epoch seconds
 * @throws {createErrors<400>} - when no new XP data is provided, or some settings are missing from newXP
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found, or the user has no XP data in that guild
 * @returns {UserXPResult}
 */
export async function replaceUserXP(guildID: bigint | number, userID: bigint | number, newXP: ReplaceUserXPInput): Promise<UserXP> {
  if (!('XP' in newXP && 'Level' in newXP && 'XPLock' in newXP && 'VoiceChannelXPLock' in newXP)) {
    throw createErrors(400, 'New XP object must contain XP, Level, XPLock, and VoiceChannelXPLock');
  }
  const userGuildID: number = await getUserGuildID(guildID, userID, 'UserGuildXP');
  await DB.execute('UPDATE XP SET XP = ?, Level = ?, XPLock = FROM_UNIXTIME(?), VoiceChannelXPLock = FROM_UNIXTIME(?) WHERE UserGuildID = ?', [newXP.XP, newXP.Level, newXP.XPLock, newXP.VoiceChannelXPLock, userGuildID]);
  return { UserID: userID.toString(), GuildID: guildID.toString(), XP: newXP.XP.toString(), Level: newXP.Level.toString(), XPLock: newXP.XPLock.toString(), VoiceChannelXPLock: newXP.VoiceChannelXPLock.toString() };
}
