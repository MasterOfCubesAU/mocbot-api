
import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import lodash from 'lodash';

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

/**
 * Updates the settings for a guild ID given an object with only the new changes to be made
 * @param guildID the guild ID to update
 * @param {object} newSettings an object with the settings to update
 * @throws {createErrors<400>} if no new settings are provided
 * @throws {createErrors<404>} if the guild ID does not exist
 * @returns {object} empty object on success
 */
export async function updateSettings(guildID: bigint | number, newSettings: object): Promise<any> {
  if (Object.keys(newSettings).length === 0) {
    throw createErrors(400, 'New settings for this guild must be provided.');
  }
  const oldSettings = await DB.field('SELECT SettingsData FROM GuildSettings WHERE GuildID = ?', [guildID]);
  if (oldSettings === null) {
    throw createErrors(404, 'Settings for this guild does not exist.');
  }
  await DB.execute('UPDATE GuildSettings SET SettingsData = ? WHERE GuildID = ?', [lodash.merge(oldSettings, newSettings), guildID]);
}

/**
 * Removes settings for a given guild
 * @param {bigint | number} guildID The guild ID to delete
 * @throws {createErrors<404>} if guild ID not found
 * @returns {}
 */
export async function deleteSettings(guildID: bigint | number): Promise<any> {
  if (Object.keys(await DB.record('SELECT * FROM GuildSettings WHERE GuildID = ?', [guildID])).length === 0) {
    throw createErrors(404, 'This guild does not exist.');
  }
  await DB.execute('DELETE FROM GuildSettings WHERE GuildID = ?', [guildID]);
  return {};
}
