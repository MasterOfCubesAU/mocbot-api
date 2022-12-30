import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { Roles, RolesInput } from '@src/interfaces/roles';
import lodash from 'lodash';

/**
 * Creates a roles lookup table for a server
 *
 * @param {bigint | number} guildID - the guildID to add roles for
 * @param {roles} roles - the roles to add for the guild
 * @throws {createErrors<400>} - when roles object is empty, or both LevelRoles and JoinRoles are not provided
 * @throws {createErrors<409>} - when roles for the guild already exist
 * @returns {Promise<Roles>}
 */
export async function createRoles(guildID: bigint | number, roles: RolesInput): Promise<Roles> {
  checkRolesInput(roles);

  try {
    await DB.execute('INSERT INTO Roles (GuildID, LevelRoles, JoinRoles) VALUES (?, ?, ?)', [guildID, roles.LevelRoles || null, roles.JoinRoles || null]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createErrors(409, 'Roles for this guild already exists.');
    } else {
      throw error;
    }
  }

  return {
    LevelRoles: roles.LevelRoles || null,
    JoinRoles: roles.JoinRoles || null,
  };
}

/**
 * Fetches the current roles for a server
 *
 * @param {bigint | number} guildID - the guildID to get roles for
 * @throws {createErrors<404>} - when roles for the guild do not exist
 * @returns {Promise<Roles>}
 */
export async function getRoles(guildID: bigint | number): Promise<Roles> {
  const res: Roles = await DB.record('SELECT LevelRoles, JoinRoles FROM Roles WHERE GuildID = ?', [guildID]);
  if (Object.keys(res).length === 0) {
    throw createErrors(404, 'Roles for this guild do not exist.');
  }
  return res;
}

/**
 * Replaces an existing roles configuration with a new configuration
 *
 * @param {bigint | number} guildID - the guildID to replace roles for
 * @param {roles} roles - the roles to replace for the guild
 * @throws {createErrors<400>} - when roles object is empty, or both LevelRoles and JoinRoles are not provided
 * @throws {createErrors<404>} - when roles for the guild do not exist
 * @returns {Promise<Roles>}
 */
export async function setRoles(guildID: bigint | number, roles: RolesInput): Promise<Roles> {
  checkRolesInput(roles);

  await getRoles(guildID);
  await DB.execute('UPDATE Roles SET LevelRoles = ?, JoinRoles = ? WHERE GuildID = ?', [roles.LevelRoles || null, roles.JoinRoles || null, guildID]);
  return {
    LevelRoles: roles.LevelRoles || null,
    JoinRoles: roles.JoinRoles || null,
  };
}

/**
 * Updates existing roles for a server
 *
 * @param {bigint | number} guildID - the guildID to update roles for
 * @param {roles} roles - the roles to update for the guild
 * @throws {createErrors<400>} - when roles object is empty, or both LevelRoles and JoinRoles are not provided
 * @throws {createErrors<404>} - when roles for the guild do not exist
 * @returns {Promise<Roles>}
 */
export async function updateRoles(guildID: bigint | number, roles: RolesInput): Promise<Roles> {
  checkRolesInput(roles);

  const oldRoles: Roles = await getRoles(guildID);
  const newLevelRoles: Roles['LevelRoles'] = lodash.merge(oldRoles.LevelRoles, roles.LevelRoles);
  const newJoinRoles: Roles['JoinRoles'] = lodash.union(oldRoles.JoinRoles, roles.JoinRoles);
  await DB.execute('UPDATE Roles SET LevelRoles = ?, JoinRoles = ? WHERE GuildID = ?', [newLevelRoles || null, newJoinRoles || null, guildID]);
  return {
    LevelRoles: newLevelRoles,
    JoinRoles: newJoinRoles,
  };
}

/**
 * Removes roles for a given guild
 *
 * @param {bigint | number} guildID - the guildID to delete roles data for
 * @throws {createErrors<404>} - if no roles data was found for the given guildID
 * @returns {}
 */
export async function deleteRoles(guildID: bigint | number): Promise<Record<string, never>> {
  await getRoles(guildID);

  await DB.execute('DELETE FROM Roles WHERE GuildID = ?', [guildID]);
  return {};
}

/**
 * Checks the validity of the input data of roles
 *
 * @throws {createErrors<400>} - when roles object is empty, or both LevelRoles and JoinRoles are not provided
 * @param {RolesInput} roles - the roles input object
 */
function checkRolesInput(roles: RolesInput) {
  if (Object.keys(roles).length === 0) {
    throw createErrors(400, 'Roles for this guild must be provided.');
  }
  if ('LevelRoles' in roles && Object.keys(roles.LevelRoles).length === 0 && roles.JoinRoles?.length === 0) {
    throw createErrors(400, 'Roles for this guild must be provided.');
  }
}
