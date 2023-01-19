import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { Verification, LockdownInput } from '@interfaces/verification';
import { createUserGuildID, getUserGuildID } from '@utils/Misc';
import lodash from 'lodash';

const selectQuery = 'UserID, GuildID, MessageID, ChannelID, UNIX_TIMESTAMP(JoinTime) AS JoinTime';

/**
 * Adds a user from a given guild into verification. Putting this user into lock down immediately is possible
 *
 * @param {bigint | number} userID - the userID to add to verification
 * @param {bigint | number} guildID - the guildID the user belongs to
 * @param {bigint | number | undefined} messageID - optional ID of the lock down approval message
 * @param {bigint | number | undefined} channelID - optional ID of the lock down approval channel
 * @throws {createErrors<409>} - user already in verification
 * @returns {Promise<Verification>}
 */
export async function addVerification(userID: bigint | number, guildID: bigint | number, messageID?: bigint | number, channelID?: bigint | number): Promise<Verification> {
  const userGuildID = await createUserGuildID(guildID, userID);
  const TIME = Math.floor(Date.now() / 1000);
  try {
    await DB.execute('INSERT INTO Verification (UserGuildID, MessageID, ChannelID, JoinTime) VALUES (?, ?, ?, FROM_UNIXTIME(?))', [userGuildID, messageID || null, channelID || null, TIME]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createErrors(409, 'The user is already in verification.');
    } else {
      throw error;
    }
  }
  return {
    UserID: userID.toString(),
    GuildID: guildID.toString(),
    MessageID: null,
    ChannelID: null,
    JoinTime: TIME.toString(),
  };
}

/**
 * Fetches verification data for the given user
 *
 * @param {bigint | number} guildID - the guildID to fetch verification data from
 * @param {bigint | number} userID - the userID to fetch verification data for
 * @throws {createErrors<404>} - if verification data could not be found
 * @returns {Promise<Verification>}
 */
export async function getVerification(guildID: bigint | number, userID: bigint | number): Promise<Verification> {
  const res: Verification = await DB.record(`SELECT ${selectQuery} FROM UserGuildVerification WHERE GuildID = ? AND UserID = ?`, [guildID, userID]);
  if (Object.keys(res).length === 0) {
    throw createErrors(404, 'Verification data for this user in this guild does not exist.');
  }
  return res;
}

/**
 * Fetches verification data for users in the given guild
 *
 * @param {bigint | number} guildID - the guildID to fetch verification data from
 * @throws {createErrors<404>} - if verification data could not be found
 * @returns {Promise<Verification>}
 */
export async function getGuildVerification(guildID: bigint | number): Promise<Verification[]> {
  const res: Verification[] = await DB.records(`SELECT ${selectQuery} FROM UserGuildVerification WHERE GuildID = ?`, [guildID]);
  if (res.length === 0) {
    throw createErrors(404, 'Verification data for the provided guild does not exist.');
  }

  return res;
}

/**
 * Remove a user from verification
 *
 * @param {bigint | number} userID - the userID to add to verification
 * @param {bigint | number} guildID - the guildID the user belongs to
 * @throws {createErrors<404>} - guildID/userID not found in the database
 * @returns {}
 */
export async function removeVerification(userID: bigint | number, guildID: bigint | number): Promise<Record<string, never>> {
  const userGuildID = await getUserGuildID(guildID, userID, 'UserGuildVerification');
  await DB.execute('DELETE FROM Verification WHERE UserGuildID = ?', [userGuildID]);
  return {};
}

/**
 * Adds a user from a given guild into verification. Putting this user into lock down immediately is possible
 *
 * @param {bigint | number} userID - the UserID to add to verification
 * @param {bigint | number} guildID - the guildID the user belongs to
 * @param {LockdownInput} data - the new lock down data to add to the user
 * @throws {createErrors<400>} - if provided lock down data is not complete or data is empty
 * @throws {createErrors<404>} - userID/guildID not found in the database
 * @returns {Promise<Verification>}
 */
export async function updateVerification(userID: bigint | number, guildID: bigint | number, data: LockdownInput): Promise<Verification> {
  if (Object.keys(data).length === 0) {
    throw createErrors(400, 'Lock down data can not be empty');
  }
  if (Object.keys(data).length !== 2 || !('MessageID' in data && 'ChannelID' in data)) {
    throw createErrors(400, 'MessageID and ChannelID not provided');
  }
  const userGuildID = await getUserGuildID(guildID, userID, 'UserGuildVerification');
  const oldData: Verification = await DB.record('SELECT UserID, GuildID, MessageID, ChannelID, UNIX_TIMESTAMP(JoinTime) AS JoinTime FROM UserGuildVerification WHERE UserGuildID = ?', [userGuildID]);
  const newData: Verification = lodash.merge(oldData, data);
  await DB.execute('UPDATE Verification SET MessageID = ?, ChannelID = ? WHERE UserGuildID = ?', [newData.MessageID, newData.ChannelID, userGuildID]);
  return newData;
}
