
import DB from '@utils/DBHandler';
import createErrors from 'http-errors';

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
