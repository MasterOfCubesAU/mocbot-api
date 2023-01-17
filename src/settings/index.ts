import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { Settings } from '@src/interfaces/settings';
import lodash from 'lodash';

/**
 * Stores settings for a given guild ID into the database
 *
 * @param {bigint | number} guildID - the guildID to create settings for
 * @param {Settings} settings - an object with key:value pairs of settings for this guild
 * @throws {createErrors<400>} - if settings not provided
 * @throws {createErrors<409>} - if settings already exist
 * @returns {Promise<Settings>}
 */
export async function createSettings(guildID: bigint | number, settings: Settings): Promise<Settings> {
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
  return settings;
}

/**
 * Fetches settings for the given guild
 *
 * @param {bigint | number} guildID - the guildID to fetch settings data for
 * @throws {createErrors<404>} - if settings for that guildID are not found
 * @returns {Promise<Settings>}
 */
export async function getSettings(guildID: bigint | number): Promise<Settings> {
  const res: Settings = await DB.field('SELECT SettingsData FROM GuildSettings WHERE GuildID = ?', [guildID]);
  if (res === null) {
    throw createErrors(404, 'Settings for this guild do not exist.');
  }
  return res;
}

/**
 * Sets the settings for a guild ID given an object with the complete new settings
 *
 * @param {bigint | number} guildID - the guildID to update settings data for
 * @param {Settings} settings - the new settings to override
 * @throws {createErrors<400>} - when settings are empty
 * @throws {createErrors<404>} - when no settings are found for the given guildID
 * @returns {Promise<Settings>}
 */
export async function setSettings(guildID: bigint | number, settings: Settings): Promise<Settings> {
  if (Object.keys(settings).length === 0) {
    throw createErrors(400, 'Settings can not be empty');
  }
  await getSettings(guildID);
  await DB.execute('UPDATE GuildSettings SET SettingsData = ? WHERE GuildID = ?', [settings, guildID]);
  return settings;
}

/**
 * Updates the settings for a guild ID given an object with only the new changes to be made
 *
 * @param {bigint | number} guildID - the guildID to update settings data for
 * @param {Settings} newSettings - an object with the settings to update
 * @throws {createErrors<400>} - if no new settings are provided
 * @throws {createErrors<404>} - when no settings are found for the given guildID
 * @returns {Promise<Settings>}
 */
export async function updateSettings(guildID: bigint | number, newSettings: Settings): Promise<Settings> {
  if (Object.keys(newSettings).length === 0) {
    throw createErrors(400, 'New settings for this guild must be provided.');
  }
  const oldSettings: Settings = await getSettings(guildID);

  const objectSettings = Object.fromEntries(Object.entries(newSettings).filter(entry => typeof entry[1] === 'object'));
  const literalSettings = Object.fromEntries(Object.entries(newSettings).filter(entry => typeof entry[1] !== 'object'));

  const newLiteralSettings: Settings = lodash.merge(oldSettings, literalSettings);
  const allSettings = { ...newLiteralSettings, ...objectSettings };
  await DB.execute('UPDATE GuildSettings SET SettingsData = ? WHERE GuildID = ?', [allSettings, guildID]);
  return allSettings;
}

/**
 * Removes settings for a given guild
 *
 * @param {bigint | number} guildID - the guildID to delete settings data for
 * @throws {createErrors<404>} - if no settings data found for the given guildID
 * @returns {}
 */
export async function deleteSettings(guildID: bigint | number): Promise<Record<string, never>> {
  await getSettings(guildID);
  await DB.execute('DELETE FROM GuildSettings WHERE GuildID = ?', [guildID]);
  return {};
}
