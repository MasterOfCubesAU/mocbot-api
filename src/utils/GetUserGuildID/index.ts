import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

/**
 * Given a guildID and userID, return its corresponding userGuildID, otherwise throw a 404
 *
 * @param {bigint | number} guildID - the guildID in question
 * @param {bigint | number} userID - the userID in question
 * @throws {createErrors<404>} - when userGuildID is not found
 * @returns {Promise<number>} - the corresponding userGuildID
 */
export default async function getUserGuildID(guildID: bigint | number, userID: bigint | number): Promise<number> {
  const userGuildID: number = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  if (userGuildID === null) {
    throw createErrors(404, 'This Guild/User ID does not exist.');
  }

  return userGuildID;
}
