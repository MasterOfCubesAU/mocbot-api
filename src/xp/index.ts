import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import lodash from 'lodash';

/**
 * Fetches all the XP data for the given guildId
 *
 * @param {bigint | number} guildID - the guild id to fetch xp for
 * @throws {createErrors<404>} - when guildId is not found in database
 * @returns {object}
 */
export async function fetchGuildXP(guildID: bigint | number): Promise<any> {
  const result = await DB.records('SELECT x.* FROM XP AS x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ?', [guildID]);
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
export async function deleteGuildXP(guildID: bigint | number): Promise<any> {
  if ((await DB.records('SELECT x.* FROM XP as x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE GuildID = ?', [guildID])).length === 0){
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
export async function fetchUserXP(guildID: bigint | number, userID: bigint | number): Promise<any> {
  const result = await DB.record('SELECT x.* FROM XP AS x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ? AND u.UserID = ?', [guildID, userID]);
  if (Object.keys(result).length === 0) {
    throw createErrors(404, 'This Guild/User ID does not exist.');
  }
  return result;
}

/**
 * Creates a new XP object for a user
 *
 * @param {bigint | number} guildID - the guild id to create xp object for
 * @param {bigint | number} userID - the user id to create xp object for
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found
 * @throws {createErrors<409>} - when an entry for that user in that guild already exists
 * @returns {object}
 */
export async function postUserXP(guildID: bigint | number, userID: bigint | number): Promise<any> {
  const userGuildID: number = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE guildID = ? AND UserID = ?', [guildID, userID]);
  if (userGuildID === undefined) {
    throw createErrors(404, 'This Guild/User ID does not exist.');
  }

  try {
    await DB.execute('INSERT INTO XP (UserGuildID, XP, Level) VALUES (?, ?, ?)', [userGuildID, 0, 0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createErrors(409, 'XP data for this user in this guild already exists.');
    } else {
      throw error;
    }
  }
}

/**
 * Updates an existing XP object for a user
 *
 * @param {bigint | number} guildID - the guild id to update the xp object for
 * @param {bigint | number} userID - the user id to update the xp object for
 * @param {object} newXP - the new data to update
 * @throws {createErrors<400>} - when no new XP data is provided
 * @throws {createErrors<404>} - when the combination of the userID and guildID is not found, or the user has no XP data in that guild
 * @returns {object}
 */
export async function updateUserXP(guildID: bigint | number, userID: bigint | number, newXP: object): Promise<any> {
  if (Object.keys(newXP).length === 0) {
    throw createErrors(400, 'No new data was provided');
  }
  const oldXP = await DB.record('SELECT x.* FROM XP x INNER JOIN UserInGuilds u ON x.UserGuildID = u.UserGuildID WHERE u.UserID = ? AND u.GuildID = ?', [userID, guildID]);
  if (Object.keys(oldXP).length === 0) {
    throw createErrors(404, 'XP data for this user in this guild does not exist.');
  }

  const userGuildID = oldXP.UserGuildID;
  const newData = lodash.merge(oldXP, newXP);
  await DB.execute('UPDATE XP SET XP = ?, Level = ?, XPLock = ?, VC_XPLock = ? WHERE UserGuildID = ?', [oldXP.XP, oldXP.Level, oldXP.XPLock, oldXP.VC_XPLock, userGuildID]);
  return newData;
}
