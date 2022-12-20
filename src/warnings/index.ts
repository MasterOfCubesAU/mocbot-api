import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a warning for a given user within a particular guild
 * @param {bigint | number} userID The user ID to create a warning for
 * @param {bigint | number} guildID The guild ID the user belongs to
 * @param {string} reason The reason for the warning
 * @param {bigint | number} adminID The adminID who distributed the warning
 * @throws {createErrors<400>} Reason/AdminID is left empty
 * @throws {createErrors<404>} User/Guild ID does not exist
 * @returns {object} the warning created
 */
export async function createWarning(userID: bigint | number, guildID: bigint | number, reason: string, adminID: bigint | number) {
  if (reason === undefined || reason === '') {
    throw createErrors(400, 'Reason cannot be empty.');
  }
  if (adminID === undefined) {
    throw createErrors(400, 'AdminID cannot be empty.');
  }
  const UserGuildID = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  if (UserGuildID === null) {
    throw createErrors(404, 'User/Guild ID does not exist.');
  }
  const RESULT = {
    WarningID: uuidv4(),
    UserGuildID: UserGuildID,
    Reason: reason,
    Time: Date.now(),
    AdminID: adminID,
  };
  await DB.execute('INSERT INTO Warnings (WarningID, UserGuildID, Reason, Time, AdminID) VALUES (?, ?, ?, ?, ?)', Object.values({ ...RESULT, Time: (new Date(RESULT.Time)).toISOString().slice(0, 19).replace('T', ' ') }));
  return RESULT;
}
