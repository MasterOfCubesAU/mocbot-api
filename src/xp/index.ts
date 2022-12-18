import DatabaseHandler from '@utils/DBHandler';
import createErrors from 'http-errors';

export async function fetchGuildXP(guild_id: string): Promise<any> {
  const result = await DatabaseHandler.records('SELECT * FROM XP AS x INNER JOIN UserInGuilds u ON u.UserGuildID = x.UserGuildID WHERE u.GuildID = ?', [guild_id]);
  if (!result) createErrors(404, 'Guild ID not found in database');
  return result;
}
