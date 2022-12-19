
import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

/**
 * Stores settings for a given guild ID into the database
 *
 * @param guildID The guild ID to create settings for
 * @param settings an object with key:value pairs of settings for this guild
 * @throws {createErrors<400>}
 * @throws {createErrors<409>}
 * @returns {object} Empty object
 */
export async function createSettings(guildID: bigint | number, settings: object): Promise<any> {
  if (Object.keys(settings).length === 0) {
    throw createErrors(400, 'Settings for this guild must be provided.');
  }
  try {
    await DB.execute('INSERT INTO GuildSettings (GuildID, SettingsData) VALUES (?, ?)', [guildID, settings]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createErrors(409, 'Settings for this guild already exists.');
    } else {
      throw error;
    }
  }
  return {};
}

export async function getSettings(guildID: bigint | number): Promise<any> {
  const result = await DB.field('SELECT SettingsData FROM GuildSettings WHERE GuildID = ?', [guildID]);
  if (result === null) {
    throw createErrors(404, 'This guild does not exist.');
  }
  return result;
}
