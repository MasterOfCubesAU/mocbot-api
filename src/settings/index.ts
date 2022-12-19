
import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

/**
 * Stores settings for a given guild ID into the database
 *
 * @param {bigint | number} guildID The guild ID to create settings for
 * @param {object} settings an object with key:value pairs of settings for this guild
 * @throws {createErrors<400>} if settings not provided
 * @throws {createErrors<409>} if settings already exist
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

/**
 * Fetches settings for the given guild
 * @param guildID The guild ID to fetch
 * @throws {createErrors<404>} if not found
 * @returns {object}
 */
export async function getSettings(guildID: bigint | number): Promise<any> {
  const result = await DB.field('SELECT SettingsData FROM GuildSettings WHERE GuildID = ?', [guildID]);
  if (result === null) {
    throw createErrors(404, 'This guild does not exist.');
  }
  return result;
}
