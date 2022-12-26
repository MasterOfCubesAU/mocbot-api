import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

/**
 * Given a guildID and userID, return its corresponding userGuildID, otherwise throw a 404
 *
 * @param {bigint | number} guildID - the guildID in question
 * @param {bigint | number} userID - the userID in question
 * @param {string} table - the table to search UserGuildID in, by default being 'UserInGuilds'
 * @throws {createErrors<404>} - when userGuildID is not found
 * @returns {Promise<number>} - the corresponding userGuildID
 */
export async function getUserGuildID(guildID: bigint | number, userID: bigint | number, table = 'UserInGuilds'): Promise<number> {
  const userGuildID: number = await DB.field(`SELECT UserGuildID FROM ${table} WHERE GuildID = ? AND UserID = ?`, [guildID, userID]);
  if (userGuildID === null) {
    throw createErrors(404, 'This Guild/User ID does not exist.');
  }

  return userGuildID;
}

/**
 * Creates a userGuild object and returns the ID, if it does not exist in UserInGuilds
 *
 * @param {number | bigint} guildID - the guildID of the user
 * @param {number | bigint} userID - the userID of the user
 * @returns {Promise<number>} - the existing userGuildID of the user or after it has been created
 */
export async function createUserGuildID(guildID: bigint | number, userID: bigint | number): Promise<number> {
  let userGuildID: number = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  if (userGuildID === null) {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) values (?, ?)', [userID, guildID]);
    userGuildID = await getUserGuildID(guildID, userID);
  }
  return userGuildID;
}
