import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { Warning } from '@interfaces/warnings';

/**
 * Creates a warning for a given user within a particular guild
 * @param {bigint | number} userID The user ID to create a warning for
 * @param {bigint | number} guildID The guild ID the user belongs to
 * @param {string} reason The reason for the warning
 * @param {bigint | number} adminID The adminID who distributed the warning
 * @throws {createErrors<400>} Reason/AdminID is left empty
 * @returns {object} the warning created
 */
export async function createWarning(userID: bigint | number, guildID: bigint | number, reason: string, adminID: bigint | number): Promise<Warning> {
  if (reason === undefined || reason === '') {
    throw createErrors(400, 'Reason cannot be empty.');
  }
  if (adminID === undefined) {
    throw createErrors(400, 'AdminID cannot be empty.');
  }
  let userGuildID: number = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  if (userGuildID === null) {
    await DB.execute('INSERT INTO UserInGuilds (UserID, GuildID) values (?, ?)', [userID, guildID]);
    userGuildID = await DB.field('SELECT UserGuildID FROM UserInGuilds WHERE GuildID = ? AND UserID = ?', [guildID, userID]);
  }
  const RESULT: Warning = {
    WarningID: uuidv4(),
    UserGuildID: userGuildID,
    Reason: reason,
    Time: Math.floor(Date.now() / 1000),
    AdminID: adminID,
  };
  await DB.execute('INSERT INTO Warnings (WarningID, UserGuildID, Reason, Time, AdminID) VALUES (?, ?, ?, FROM_UNIXTIME(?), ?)', Object.values(RESULT));
  return RESULT;
}

/**
 * Fetches all user warnings from a given guild
 * @param userID the user ID to fetch warnings for
 * @param guildID the guild ID the user belongs to
 * @throws {createErrors<404>} if User/Guild ID not found
 * @returns {Array} of warnings belonging to that user
 */
export async function getUserWarnings(userID: bigint | number, guildID: bigint | number): Promise<Warning[]> {
  const result: Warning[] = await DB.records('SELECT w.WarningID, w.UserGuildID, w.Reason, UNIX_TIMESTAMP(w.Time) AS Time, w.AdminID FROM Warnings AS w INNER JOIN UserInGuilds u ON w.UserGuildID = u.UserGuildID WHERE u.GuildID = ? AND u.UserID = ?', [guildID, userID]);
  if (result.length === 0) throw createErrors(404, 'User/Guild ID not found in database');
  return result;
}

/**
 * Deletes a given warning ID.
 * @param warningID the warningID to delete
 * @throws {createErrors<404>} Warning ID not found.
 * @returns {}
 */
export async function deleteWarning(warningID: string): Promise<Record<string, never>> {
  if (await DB.field('SELECT WarningID FROM Warnings WHERE WarningID = ?', [warningID]) === null) {
    throw createErrors(404, 'Warning ID not found');
  }
  await DB.execute('DELETE FROM Warnings WHERE WarningID = ?', [warningID]);
  return {};
}

/**
 * Removes all warnings for a given guild
 * @param {bigint | number} guildID The guild ID to delete warnings from
 * @throws {createErrors<404>} Guild ID not found
 * @returns {}
 */
export async function deleteGuildWarnings(guildID: bigint | number): Promise<Record<string, never>> {
  const result: Warning[] = await DB.records('SELECT w.WarningID, w.UserGuildID, w.Reason, UNIX_TIMESTAMP(w.Time) AS Time, w.AdminID FROM Warnings AS w INNER JOIN UserInGuilds u ON w.UserGuildID = u.UserGuildID WHERE u.GuildID = ?', [guildID]);
  if (result.length === 0) throw createErrors(404, 'Guild ID not found in database');
  await DB.execute('DELETE w FROM Warnings AS w INNER JOIN UserInGuilds u ON w.UserGuildID = u.UserGuildID WHERE u.GuildID = ?', [guildID]);
  return {};
}
