import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

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
  console.log(userGuildID);
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
 * Deletes the XP data for a given guildId
 *
 * @param {bigint | number} guildID - the guild id to delete xp data for
 * @throws {createErrors<404>} - when guildId is not found in database
 * @returns {} - on success
 */
export async function deleteGuildXP(guildID: bigint | number): Promise<any> {
  if (Object.keys(await DB.record('SELECT * FROM UserInGuilds WHERE GuildID = ?', [guildID])).length === 0) {
    throw createErrors(404, 'This guild does not exist.');
  }

  await DB.execute('DELETE x FROM XP x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ?', [guildID]);
  return {};
}

/**
 * Deletes the XP data for a given guildId and userId
 *
 * @param {bigint | number} guildID - the guild id to delete xp data for
 * @param {bigint | number} userID - the user id to delete xp data for
 * @throws {createErrors<404>} - when guildId/userId is not found in database
 * @returns {} - on success
 */
export async function deleteUserXP(guildID: bigint | number, userID: bigint | number): Promise<any> {
  const userGuildID: number = await DB.field('SELECT * FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  if (userGuildID === undefined) {
    throw createErrors(404, 'This guild does not exist.');
  }

  await DB.execute('DELETE FROM XP WHERE UserGuildID = ?', [userGuildID]);
  return {};
}
