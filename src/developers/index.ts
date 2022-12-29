import DB from '@utils/DBHandler';

/**
 * Gets the developer userIDs
 * @returns {Promise<string[]>}
 */
export async function getDevelopers(): Promise<string[]> {
  return await DB.column('SELECT UserID FROM Developers');
}
