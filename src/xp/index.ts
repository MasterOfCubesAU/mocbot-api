import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

/**
 * Fetches all the XP data for the given guildId
 *
 * @param {string} guildID - the guild id to fetch xp for
 * @throws {createErrors<404>} - when guildId is not found in database
 * @returns {object}
 */
export async function fetchGuildXP(guildID: string): Promise<any> {
  const result = await DB.records('SELECT x.* FROM XP AS x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ?', [guildID]);
  if (result.length === 0) throw createErrors(404, 'Guild ID not found in database');
  return result;
}
