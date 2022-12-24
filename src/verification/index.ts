import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { Verification, LockdownInput } from '@interfaces/verification';
import { createUserGuildID, getUserGuildID } from '@utils/Misc';
import lodash from 'lodash';

/**
 * Adds a user from a given guild into verification. Putting this user into lock down immediately is possible
 * @param {bigint | number} userID The User ID to add to verification
 * @param {bigint | number} guildID The guild ID the user belongs to
 * @param {bigint | number | undefined} messageID Optional ID of the lock down approval message
 * @param {bigint | number | undefined} channelID Optional ID of the lock down approval channel
 * @throws {createErrors<409>} User already in verification
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
    UserID: userID,
    GuildID: guildID,
    JoinTime: TIME
  };
}

/**
 * Remove a user from verification
 * @param {bigint | number} userID The User ID to add to verification
 * @param {bigint | number} guildID The guild ID the user belongs to
 * @throws {createErrors<404>} Guild/User ID not found
 * @returns {}
 */
export async function removeVerification(userID: bigint | number, guildID: bigint | number): Promise<Record<string, never>> {
  const userGuildID = await getUserGuildID(guildID, userID);
  await DB.execute('DELETE FROM Verification WHERE UserGuildID = ?', [userGuildID]);
  return {};
}

/**
 * Adds a user from a given guild into verification. Putting this user into lock down immediately is possible
 * @param {bigint | number} userID The User ID to add to verification
 * @param {bigint | number} guildID The guild ID the user belongs to
 * @param {LockdownInput} data the new lock down data to add to the user
 * @throws {createErrors<400>} if provided lock down data is not complete or data is empty
 * @throws {createErrors<404>} User/Guild ID not found
 * @throws {createErrors<409>} User already in verification
 * @returns {Promise<Verification>}
 */
export async function updateVerification(userID: bigint | number, guildID: bigint | number, data: LockdownInput): Promise<Verification> {
  if (Object.keys(data).length === 0) {
    throw createErrors(400, 'Lock down data can not be empty');
  }
  if (Object.keys(data).length !== 2 || !('MessageID' in data && 'ChannelID' in data)) {
    throw createErrors(400, 'MessageID and ChannelID not provided');
  }
  const userGuildID = await getUserGuildID(guildID, userID);
  const oldData: Verification = await DB.record('SELECT MessageID, ChannelID, UNIX_TIMESTAMP(JoinTime) FROM Verification WHERE UserGuildID = ?', [userGuildID]);
  const newData: Verification = lodash.merge(oldData, data);
  await DB.execute('UPDATE Verification SET MessageID = ?, ChannelID = ? WHERE UserGuildID = ?', [newData.MessageID, newData.ChannelID, userGuildID]);
  return newData;
}
