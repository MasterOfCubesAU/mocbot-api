import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { AFK, AFKInput } from '@interfaces/afk';
import { createUserGuildID, getUserGuildID } from '@utils/Misc';

/**
 * Gets the AFK data for a user in a given guildID
 *
 * @param {bigint | number} userID - the userID of the user
 * @param {bigint | number} guildID - the guildID of the user
 * @throws {createErrors<404>} - if no AFK data was found for the userID/guildID
 * @returns {Promise<AFK>}
 */
export async function getAFK(userID: bigint | number, guildID: bigint | number): Promise<AFK> {
  const result: AFK = await DB.record('SELECT UserID, GuildID, MessageID, ChannelID, OldName, Reason FROM UserGuildAFK WHERE GuildID = ? and UserID = ?', [guildID, userID]);
  if (Object.keys(result).length === 0) throw createErrors(404, 'No AFK data for that user in the given guild was found in the database');
  return result;
}

/**
 * Sets relevant data for a user who has become AFK in a guildID
 *
 * @param {bigint | number} userID - the userID of the user
 * @param {bigint | number} guildID - the guildID of the user
 * @param {AFKInput} data - the AFK data to be set
 * @throws {createErrors<400>} - if new data not provided/some fields missing
 * @throws {createErrors<409>} - if AFK data already exists for the user in the given guild
 * @returns {Promise<AFK>}
 */
export async function insertAFK(userID: bigint | number, guildID: bigint | number, data: AFKInput): Promise<AFK> {
  const userGuildID = await createUserGuildID(guildID, userID);
  if (!('MessageID' in data && 'ChannelID' in data && 'OldName' in data && 'Reason' in data)) {
    throw createErrors(400, 'Missing fields in data');
  }

  try {
    await DB.execute('INSERT INTO AFK (UserGuildID, MessageID, ChannelID, OldName, Reason) VALUES (?, ?, ?, ?, ?)', [userGuildID, ...Object.values(data)]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createErrors(409, 'The user is already in AFK.');
    } else {
      throw error;
    }
  }
  return {
    UserID: userID.toString(),
    GuildID: guildID.toString(),
    MessageID: data.MessageID,
    ChannelID: data.ChannelID,
    OldName: data.OldName,
    Reason: data.Reason,
  };
}

/**
 * Removes a user from AFK
 *
 * @param {bigint | number} userID - the userID to remove from AFK
 * @param {bigint | number} guildID - the guildID the user belongs to
 * @throws {createErrors<404>} - guildID/userID not found in the database
 * @returns {}
 */
export async function removeAFK(userID: bigint | number, guildID: bigint | number): Promise<Record<string, never>> {
  const userGuildID = await getUserGuildID(guildID, userID, 'UserGuildAFK');
  await DB.execute('DELETE FROM AFK WHERE UserGuildID = ?', [userGuildID]);
  return {};
}
